import type { Enums } from '~/types/database'

export type OrderStatus = Enums<'order_status'>

export interface AdminUser {
  id: string
  email: string
}

export interface AdminSessionResponse {
  user: AdminUser
}

export interface AdminOrderSummary {
  id: string
  orderNumber: string
  status: OrderStatus
  customerName: string
  customerPhone: string
  fulfillmentType: Enums<'fulfillment_type'>
  totalPrice: number
  totalWeight: number
  createdAt: string
}

export interface AdminOrdersResponse {
  orders: AdminOrderSummary[]
}

export interface AdminOrderItem {
  id: string
  productId: string | null
  productName: string
  unitPrice: number
  unitWeight: number
  quantity: number
  lineTotal: number
  lineWeight: number
}

export interface AdminOrderDetails extends AdminOrderSummary {
  apartment: string | null
  comment: string | null
  deliveryTimeType: Enums<'delivery_time_type'>
  entrance: string | null
  floor: string | null
  house: string | null
  items: AdminOrderItem[]
  paymentMethod: Enums<'payment_method'>
  scheduledFor: string | null
  street: string | null
  updatedAt: string
}

export interface AdminOrderResponse {
  order: AdminOrderDetails
}
