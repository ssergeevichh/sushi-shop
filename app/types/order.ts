export type FulfillmentType = 'delivery' | 'pickup'
export type DeliveryTimeType = 'asap' | 'scheduled'
export type PaymentMethod = 'cash' | 'card-on-delivery'

export interface CheckoutFormData {
  name: string
  phone: string
  fulfillment: FulfillmentType
  street: string
  house: string
  apartment: string
  entrance: string
  floor: string
  deliveryTimeType: DeliveryTimeType
  scheduledTime: string
  paymentMethod: PaymentMethod
  comment: string
}

export interface CreateOrderItem {
  productId: string
  quantity: number
}

export interface CreateOrderPayload {
  customer: {
    name: string
    phone: string
  }
  fulfillment: {
    type: FulfillmentType
    address?: {
      street: string
      house: string
      apartment?: string
      entrance?: string
      floor?: string
    }
  }
  deliveryTime: {
    type: DeliveryTimeType
    time?: string
  }
  paymentMethod: PaymentMethod
  comment?: string
  items: CreateOrderItem[]
}

export interface CreateOrderResponse {
  orderNumber: string
  createdAt: string
  totalPrice: number
}
