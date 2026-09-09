import type { AdminOrderResponse } from '../../../../app/types/admin'

export default defineEventHandler(async (event): Promise<AdminOrderResponse> => {
  const id = getRouterParam(event, 'id')

  if (!id || !uuidPattern.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Некоректне замовлення' })
  }

  const { supabase } = await requireAdmin(event)
  const [orderResult, itemsResult] = await Promise.all([
    supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: true }),
  ])

  if (orderResult.error || itemsResult.error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Не вдалося завантажити замовлення',
    })
  }

  if (!orderResult.data) {
    throw createError({ statusCode: 404, statusMessage: 'Замовлення не знайдено' })
  }

  const order = orderResult.data

  return {
    order: {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      fulfillmentType: order.fulfillment_type,
      totalPrice: order.total_price,
      totalWeight: order.total_weight,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      apartment: order.apartment,
      comment: order.comment,
      deliveryTimeType: order.delivery_time_type,
      entrance: order.entrance,
      floor: order.floor,
      house: order.house,
      paymentMethod: order.payment_method,
      scheduledFor: order.scheduled_for,
      street: order.street,
      items: itemsResult.data.map(item => ({
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
