import type { OrderStatus } from '~/types/admin'

export const ORDER_STATUS_OPTIONS: ReadonlyArray<{
  value: OrderStatus
  label: string
}> = [
  { value: 'new', label: 'Нове' },
  { value: 'confirmed', label: 'Підтверджено' },
  { value: 'preparing', label: 'Готується' },
  { value: 'ready', label: 'Готове' },
  { value: 'delivering', label: 'Доставляється' },
  { value: 'completed', label: 'Виконано' },
  { value: 'cancelled', label: 'Скасовано' },
]

export function getOrderStatusLabel(status: OrderStatus) {
  return ORDER_STATUS_OPTIONS.find(option => option.value === status)?.label ?? status
}

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function getFulfillmentLabel(type: 'delivery' | 'pickup') {
  return type === 'delivery' ? 'Доставка' : 'Самовивіз'
}

export function getPaymentLabel(type: 'cash' | 'card-on-delivery') {
  return type === 'cash' ? 'Готівкою' : 'Карткою при отриманні'
}
