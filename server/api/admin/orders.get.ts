import type {
  AdminOrdersResponse,
  AdminOrderSummary,
  OrderStatus,
} from '../../../app/types/admin'

export default defineEventHandler(async (event): Promise<AdminOrdersResponse> => {
  const { supabase } = await requireAdmin(event)
  const status = getQuery(event).status

  if (
    status !== undefined
    && (typeof status !== 'string' || !orderStatuses.includes(status as OrderStatus))
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Некоректний статус' })
  }

  let query = supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      customer_name,
      customer_phone,
      fulfillment_type,
      total_price,
      total_weight,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  if (typeof status === 'string') {
    query = query.eq('status', status as OrderStatus)
  }

  const { data, error } = await query

  if (error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Не вдалося завантажити замовлення',
    })
  }

  const orders: AdminOrderSummary[] = data.map(order => ({
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    fulfillmentType: order.fulfillment_type,
    totalPrice: order.total_price,
    totalWeight: order.total_weight,
    createdAt: order.created_at,
  }))

  return { orders }
})
