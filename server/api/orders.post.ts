import type { Json } from '../../app/types/database'
import type {
  CreateOrderResponse,
  DeliveryTimeType,
  FulfillmentType,
  PaymentMethod,
} from '../../app/types/order'

interface ParsedOrderItem {
  product_id: string
  quantity: number
}

interface ParsedOrder {
  customerName: string
  customerPhone: string
  fulfillmentType: FulfillmentType
  street: string
  house: string
  apartment: string
  entrance: string
  floor: string
  deliveryTimeType: DeliveryTimeType
  scheduledFor: string | null
  paymentMethod: PaymentMethod
  comment: string
  items: ParsedOrderItem[]
}

const phonePattern = /^\+?[\d\s()-]{10,20}$/
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const scheduledTimePattern = /^(?:1\d|20|21):(?:00|30)$/
const kyivDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Kyiv',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const kyivOffsetFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Kyiv',
  timeZoneName: 'longOffset',
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getRequiredString(value: unknown, message: string, maxLength: number) {
  if (typeof value !== 'string') {
    throw createError({ statusCode: 400, statusMessage: message })
  }

  const normalizedValue = value.trim()

  if (!normalizedValue || normalizedValue.length > maxLength) {
    throw createError({ statusCode: 400, statusMessage: message })
  }

  return normalizedValue
}

function getOptionalString(value: unknown, message: string, maxLength: number) {
  if (value === undefined || value === null || value === '') {
    return ''
  }

  if (typeof value !== 'string' || value.trim().length > maxLength) {
    throw createError({ statusCode: 400, statusMessage: message })
  }

  return value.trim()
}

function getKyivDate(date: Date) {
  const parts = Object.fromEntries(
    kyivDateFormatter
      .formatToParts(date)
      .map(part => [part.type, part.value]),
  )

  if (!parts.year || !parts.month || !parts.day) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Не вдалося визначити дату замовлення',
    })
  }

  return `${parts.year}-${parts.month}-${parts.day}`
}

function getKyivOffset(date: Date) {
  const timeZoneName = kyivOffsetFormatter
    .formatToParts(date)
    .find(part => part.type === 'timeZoneName')
    ?.value
  const offset = timeZoneName?.match(/^GMT([+-]\d{2}:\d{2})$/)?.[1]

  if (!offset) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Не вдалося визначити часовий пояс',
    })
  }

  return offset
}

function getScheduledFor(time: string) {
  if (!scheduledTimePattern.test(time)) {
    throw createError({ statusCode: 400, statusMessage: 'Обери коректний час доставки' })
  }

  const now = new Date()
  const scheduledFor = new Date(
    `${getKyivDate(now)}T${time}:00${getKyivOffset(now)}`,
  )

  if (Number.isNaN(scheduledFor.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Обери коректний час доставки' })
  }

  if (scheduledFor.getTime() <= now.getTime()) {
    throw createError({ statusCode: 400, statusMessage: 'Обраний час уже минув' })
  }

  return scheduledFor.toISOString()
}

function parseOrder(body: unknown): ParsedOrder {
  if (!isRecord(body) || !isRecord(body.customer)) {
    throw createError({ statusCode: 400, statusMessage: 'Некоректні дані замовлення' })
  }

  const customerName = getRequiredString(body.customer.name, 'Вкажи ім’я', 100)
  const customerPhone = getRequiredString(
    body.customer.phone,
    'Перевір номер телефону',
    20,
  )

  if (!phonePattern.test(customerPhone)) {
    throw createError({ statusCode: 400, statusMessage: 'Перевір номер телефону' })
  }

  if (!isRecord(body.fulfillment)) {
    throw createError({ statusCode: 400, statusMessage: 'Обери спосіб отримання' })
  }

  const fulfillmentType = body.fulfillment.type

  if (fulfillmentType !== 'delivery' && fulfillmentType !== 'pickup') {
    throw createError({ statusCode: 400, statusMessage: 'Обери спосіб отримання' })
  }

  const address = isRecord(body.fulfillment.address)
    ? body.fulfillment.address
    : {}
  const street = fulfillmentType === 'delivery'
    ? getRequiredString(address.street, 'Заповни адресу доставки', 150)
    : ''
  const house = fulfillmentType === 'delivery'
    ? getRequiredString(address.house, 'Заповни адресу доставки', 30)
    : ''
  const apartment = getOptionalString(address.apartment, 'Перевір номер квартири', 30)
  const entrance = getOptionalString(address.entrance, 'Перевір номер під’їзду', 30)
  const floor = getOptionalString(address.floor, 'Перевір номер поверху', 30)

  if (!isRecord(body.deliveryTime)) {
    throw createError({ statusCode: 400, statusMessage: 'Обери час отримання' })
  }

  const deliveryTimeType = body.deliveryTime.type

  if (deliveryTimeType !== 'asap' && deliveryTimeType !== 'scheduled') {
    throw createError({ statusCode: 400, statusMessage: 'Обери час отримання' })
  }

  const scheduledFor = deliveryTimeType === 'scheduled'
    ? getScheduledFor(getRequiredString(
        body.deliveryTime.time,
        'Обери час доставки',
        5,
      ))
    : null

  const paymentMethod = body.paymentMethod

  if (paymentMethod !== 'cash' && paymentMethod !== 'card-on-delivery') {
    throw createError({ statusCode: 400, statusMessage: 'Обери спосіб оплати' })
  }

  const comment = getOptionalString(body.comment, 'Коментар надто довгий', 300)

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Кошик порожній' })
  }

  const items = body.items.map((item): ParsedOrderItem => {
    if (!isRecord(item)) {
      throw createError({ statusCode: 400, statusMessage: 'Некоректний товар у кошику' })
    }

    const productId = getRequiredString(
      item.productId,
      'Некоректний товар у кошику',
      36,
    )

    if (
      !uuidPattern.test(productId)
      || typeof item.quantity !== 'number'
      || !Number.isInteger(item.quantity)
      || item.quantity < 1
      || item.quantity > 99
    ) {
      throw createError({ statusCode: 400, statusMessage: 'Некоректний товар у кошику' })
    }

    return {
      product_id: productId,
      quantity: item.quantity,
    }
  })

  return {
    customerName,
    customerPhone,
    fulfillmentType,
    street,
    house,
    apartment,
    entrance,
    floor,
    deliveryTimeType,
    scheduledFor,
    paymentMethod,
    comment,
    items,
  }
}

export default defineEventHandler(async (event): Promise<CreateOrderResponse> => {
  const order = parseOrder(await readBody<unknown>(event))
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc('create_order', {
    p_customer_name: order.customerName,
    p_customer_phone: order.customerPhone,
    p_fulfillment_type: order.fulfillmentType,
    p_street: order.street,
    p_house: order.house,
    p_apartment: order.apartment,
    p_entrance: order.entrance,
    p_floor: order.floor,
    p_delivery_time_type: order.deliveryTimeType,
    // PostgreSQL accepts null here, but generated function args do not express nullability.
    p_scheduled_for: order.scheduledFor as string,
    p_payment_method: order.paymentMethod,
    p_comment: order.comment,
    p_items: order.items as unknown as Json,
  })

  if (error) {
    const isInvalidOrder = error.code === '22023'

    throw createError({
      statusCode: isInvalidOrder ? 400 : 503,
      statusMessage: isInvalidOrder
        ? 'Перевір товари та дані замовлення'
        : 'Не вдалося створити замовлення. Спробуй ще раз.',
    })
  }

  const createdOrder = data[0]

  if (!createdOrder) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Не вдалося створити замовлення. Спробуй ще раз.',
    })
  }

  return {
    orderNumber: createdOrder.order_number,
    createdAt: createdOrder.created_at,
    totalPrice: createdOrder.total_price,
  }
})
