import { products } from '../../app/data/products'
import type {
  CreateOrderPayload,
  CreateOrderResponse,
} from '../../app/types/order'

const phonePattern = /^\+?[\d\s()-]{10,20}$/

export default defineEventHandler(async (event): Promise<CreateOrderResponse> => {
  const body = await readBody<CreateOrderPayload>(event)

  if (
    typeof body?.customer?.name !== 'string'
    || !body.customer.name.trim()
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Вкажи ім’я' })
  }

  if (
    typeof body.customer.phone !== 'string'
    || !phonePattern.test(body.customer.phone.trim())
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Перевір номер телефону' })
  }

  if (!['delivery', 'pickup'].includes(body.fulfillment?.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Обери спосіб отримання' })
  }

  if (
    body.fulfillment.type === 'delivery'
    && (
      !body.fulfillment.address?.street?.trim()
      || !body.fulfillment.address?.house?.trim()
    )
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Заповни адресу доставки' })
  }

  if (
    body.deliveryTime?.type === 'scheduled'
    && !body.deliveryTime.time
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Обери час доставки' })
  }

  if (!['asap', 'scheduled'].includes(body.deliveryTime?.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Обери час отримання' })
  }

  if (!['cash', 'card-on-delivery'].includes(body.paymentMethod)) {
    throw createError({ statusCode: 400, statusMessage: 'Обери спосіб оплати' })
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Кошик порожній' })
  }

  const totalPrice = body.items.reduce((total, item) => {
    const product = products.find(candidate => candidate.id === item.productId)

    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw createError({ statusCode: 400, statusMessage: 'Некоректний товар у кошику' })
    }

    return total + product.price * item.quantity
  }, 0)

  const orderId = crypto.randomUUID().split('-')[0]?.toUpperCase() ?? Date.now().toString().slice(-8)

  return {
    orderNumber: `RL-${orderId}`,
    createdAt: new Date().toISOString(),
    totalPrice,
  }
})
