import type { AdminOrderResponse, OrderStatus } from '../../../../app/types/admin'

function parseStatus(body: unknown): OrderStatus {
  if (
    typeof body !== 'object'
    || body === null
    || !('status' in body)
    || typeof body.status !== 'string'
    || !orderStatuses.includes(body.status as OrderStatus)
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Некоректний статус' })
  }

  return body.status as OrderStatus
}

export default defineEventHandler(async (event): Promise<AdminOrderResponse> => {
  const id = getRouterParam(event, 'id')

  if (!id || !uuidPattern.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Некоректне замовлення' })
  }

  const status = parseStatus(await readBody<unknown>(event))
  const { supabase } = await requireAdmin(event)
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Не вдалося змінити статус замовлення',
    })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Замовлення не знайдено' })
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: true })

  if (itemsError) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Статус змінено, але замовлення не вдалося оновити',
    })
  }

  return {
    order: {
      id: data.id,
      orderNumber: data.order_number,
      status: data.status,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      fulfillmentType: data.fulfillment_type,
      totalPrice: data.total_price,
      totalWeight: data.total_weight,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      apartment: data.apartment,
      comment: data.comment,
      deliveryTimeType: data.delivery_time_type,
      entrance: data.entrance,
      floor: data.floor,
      house: data.house,
      paymentMethod: data.payment_method,
      scheduledFor: data.scheduled_for,
      street: data.street,
      items: items.map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        unitPrice: item.unit_price,
        unitWeight: item.unit_weight,
        quantity: item.quantity,
        lineTotal: item.line_total ?? item.unit_price * item.quantity,
        lineWeight: item.line_weight ?? item.unit_weight * item.quantity,
      })),
    },
  }
})
