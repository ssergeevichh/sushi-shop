<script setup lang="ts">
import type { AdminOrderResponse, AdminOrderDetails, OrderStatus } from '~/types/admin'
import {
  formatAdminDate,
  getFulfillmentLabel,
  getPaymentLabel,
  ORDER_STATUS_OPTIONS,
} from '~/utils/admin'
import { formatPrice, formatWeight } from '~/utils/formatters'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const route = useRoute()
const { adminFetch } = useAdminFetch()
const order = ref<AdminOrderDetails | null>(null)
const selectedStatus = ref<OrderStatus>('new')
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const saveMessage = ref('')

const orderId = computed(() => String(route.params.id ?? ''))
const address = computed(() => {
  if (!order.value || order.value.fulfillmentType === 'pickup') {
    return 'Самовивіз'
  }

  return [
    order.value.street,
    order.value.house && `буд. ${order.value.house}`,
    order.value.apartment && `кв. ${order.value.apartment}`,
    order.value.entrance && `під’їзд ${order.value.entrance}`,
    order.value.floor && `поверх ${order.value.floor}`,
  ].filter(Boolean).join(', ')
})

const scheduledTime = computed(() => {
  if (!order.value || order.value.deliveryTimeType === 'asap') {
    return 'Якнайшвидше'
  }

  return order.value.scheduledFor
    ? formatAdminDate(order.value.scheduledFor)
    : 'Не вказано'
})

async function loadOrder() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await adminFetch<AdminOrderResponse>(
      `/api/admin/orders/${orderId.value}`,
    )

    order.value = response.order
    selectedStatus.value = response.order.status
  }
  catch {
    errorMessage.value = 'Не вдалося завантажити замовлення.'
  }
  finally {
    isLoading.value = false
  }
}

async function saveStatus() {
  if (!order.value || selectedStatus.value === order.value.status) {
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  saveMessage.value = ''

  try {
    const response = await adminFetch<AdminOrderResponse>(
      `/api/admin/orders/${orderId.value}`,
      {
        method: 'PATCH',
        body: { status: selectedStatus.value },
      },
    )

    order.value = response.order
    selectedStatus.value = response.order.status
    saveMessage.value = 'Статус оновлено'
  }
  catch {
    errorMessage.value = 'Не вдалося змінити статус. Спробуй ще раз.'
  }
  finally {
    isSaving.value = false
  }
}

onMounted(loadOrder)

useSeoMeta({
  title: 'Замовлення — адмін-панель',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <main class="admin-order-page">
    <NuxtLink class="admin-order-page__back" to="/admin">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m14 6-6 6 6 6" />
      </svg>
      До замовлень
    </NuxtLink>

    <div v-if="isLoading" class="admin-order-page__state" aria-live="polite">
      Завантажуємо замовлення…
    </div>

    <div v-else-if="errorMessage && !order" class="admin-order-page__state">
      <p role="alert">{{ errorMessage }}</p>
      <button type="button" @click="loadOrder">Спробувати ще раз</button>
    </div>

    <template v-else-if="order">
      <header class="admin-order-page__heading">
        <div>
          <p>Створено {{ formatAdminDate(order.createdAt) }}</p>
          <h1>{{ order.orderNumber }}</h1>
        </div>
        <AdminOrderStatus :status="order.status" />
      </header>

      <section class="admin-order-card admin-order-card--status">
        <div>
          <h2>Статус</h2>
          <p>Поточний етап виконання замовлення.</p>
        </div>

        <div class="admin-order-card__status-control">
          <select v-model="selectedStatus" @change="saveMessage = ''">
            <option
              v-for="option in ORDER_STATUS_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <button
            type="button"
            :disabled="isSaving || selectedStatus === order.status"
            @click="saveStatus"
          >
            {{ isSaving ? 'Зберігаємо…' : 'Зберегти' }}
          </button>
        </div>

        <p v-if="saveMessage" class="admin-order-page__success" role="status">
          {{ saveMessage }}
        </p>
        <p v-if="errorMessage" class="admin-order-page__error" role="alert">
          {{ errorMessage }}
        </p>
      </section>

      <div class="admin-order-page__grid">
        <section class="admin-order-card">
          <h2>Клієнт</h2>
          <dl>
            <div>
              <dt>Ім’я</dt>
              <dd>{{ order.customerName }}</dd>
            </div>
            <div>
              <dt>Телефон</dt>
              <dd><a :href="`tel:${order.customerPhone}`">{{ order.customerPhone }}</a></dd>
            </div>
          </dl>
        </section>

        <section class="admin-order-card">
          <h2>Отримання та оплата</h2>
          <dl>
            <div>
              <dt>Спосіб</dt>
              <dd>{{ getFulfillmentLabel(order.fulfillmentType) }}</dd>
            </div>
            <div>
              <dt>Адреса</dt>
              <dd>{{ address }}</dd>
            </div>
            <div>
              <dt>Час</dt>
              <dd>{{ scheduledTime }}</dd>
            </div>
            <div>
              <dt>Оплата</dt>
              <dd>{{ getPaymentLabel(order.paymentMethod) }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section class="admin-order-card">
        <h2>Склад замовлення</h2>
        <ul class="admin-order-page__items">
          <li v-for="item in order.items" :key="item.id">
            <div>
              <strong>{{ item.productName }}</strong>
              <span>
                {{ formatPrice(item.unitPrice) }} · {{ formatWeight(item.unitWeight) }} × {{ item.quantity }}
              </span>
            </div>
            <strong>{{ formatPrice(item.lineTotal) }}</strong>
          </li>
        </ul>

        <dl class="admin-order-page__total">
          <div>
            <dt>Загальна вага</dt>
            <dd>{{ formatWeight(order.totalWeight) }}</dd>
          </div>
          <div>
            <dt>До сплати</dt>
            <dd>{{ formatPrice(order.totalPrice) }}</dd>
          </div>
        </dl>
      </section>

      <section v-if="order.comment" class="admin-order-card">
        <h2>Коментар</h2>
        <p class="admin-order-page__comment">{{ order.comment }}</p>
      </section>
    </template>
  </main>
</template>

<style scoped>
.admin-order-page {
  width: min(100%, 920px);
  min-height: calc(100dvh - 68px);
  margin: 0 auto;
  padding: 24px var(--page-padding) 48px;
}

.admin-order-page__back {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 800;
}

.admin-order-page__back svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.admin-order-page__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin: 15px 0 20px;
}

.admin-order-page__heading p {
  margin-bottom: 4px;
  color: var(--color-text-muted);
  font-size: 11px;
}

.admin-order-page__heading h1 {
  font-size: 27px;
}

.admin-order-page__grid {
  display: grid;
  gap: 12px;
}

.admin-order-card {
  margin-bottom: 12px;
  padding: 19px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 5px 16px rgb(23 25 28 / 5%);
}

.admin-order-card h2 {
  margin-bottom: 15px;
  font-size: 17px;
}

.admin-order-card dl {
  display: grid;
  gap: 12px;
  margin: 0;
}

.admin-order-card dl > div {
  display: grid;
  grid-template-columns: minmax(90px, 0.4fr) minmax(0, 1fr);
  gap: 16px;
}

.admin-order-card dt {
  color: var(--color-text-muted);
  font-size: 11px;
}

.admin-order-card dd {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
  text-align: right;
}

.admin-order-card dd a {
  color: var(--color-primary-hover);
}

.admin-order-card--status > div:first-child p {
  color: var(--color-text-muted);
  font-size: 11px;
}

.admin-order-card--status h2 {
  margin-bottom: 3px;
}

.admin-order-card__status-control {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 9px;
  margin-top: 16px;
}

.admin-order-card__status-control select {
  min-width: 0;
  height: 46px;
  padding: 0 12px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid #cfd5dd;
  border-radius: 12px;
  outline: none;
  font-size: 12px;
  font-weight: 700;
}

.admin-order-card__status-control button,
.admin-order-page__state button {
  min-height: 46px;
  padding: 0 16px;
  color: white;
  background: var(--color-primary);
  border: 0;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
}

.admin-order-card__status-control button:disabled {
  cursor: default;
  opacity: 0.45;
}

.admin-order-page__items {
  display: grid;
  gap: 13px;
  margin: 0;
  padding: 0 0 17px;
  border-bottom: 1px solid var(--color-border);
  list-style: none;
}

.admin-order-page__items li {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.admin-order-page__items li > div {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.admin-order-page__items strong {
  font-size: 12px;
}

.admin-order-page__items span {
  color: var(--color-text-muted);
  font-size: 10px;
}

.admin-order-page__items li > strong {
  flex: 0 0 auto;
}

.admin-order-page__total {
  margin-top: 16px !important;
}

.admin-order-page__total > div:last-child dt,
.admin-order-page__total > div:last-child dd {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 800;
}

.admin-order-page__comment {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.admin-order-page__success,
.admin-order-page__error {
  margin-top: 10px;
  font-size: 11px;
  font-weight: 700;
}

.admin-order-page__success {
  color: #027a48;
}

.admin-order-page__error {
  color: #b42318;
}

.admin-order-page__state {
  display: grid;
  min-height: 280px;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: 13px;
}

@media (min-width: 720px) {
  .admin-order-page {
    padding-top: 34px;
  }

  .admin-order-page__grid {
    grid-template-columns: 0.8fr 1.2fr;
  }

  .admin-order-page__grid .admin-order-card {
    height: calc(100% - 12px);
  }
}
</style>
