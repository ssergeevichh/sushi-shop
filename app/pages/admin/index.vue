<script setup lang="ts">
import type {
  AdminOrdersResponse,
  AdminOrderSummary,
  OrderStatus,
} from '~/types/admin'
import {
  formatAdminDate,
  getFulfillmentLabel,
  ORDER_STATUS_OPTIONS,
} from '~/utils/admin'
import { formatPrice, formatWeight } from '~/utils/formatters'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const { adminFetch } = useAdminFetch()
const orders = ref<AdminOrderSummary[]>([])
const selectedStatus = ref<'all' | OrderStatus>('all')
const isLoading = ref(true)
const errorMessage = ref('')

async function loadOrders() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await adminFetch<AdminOrdersResponse>('/api/admin/orders', {
      query: {
        status: selectedStatus.value === 'all' ? undefined : selectedStatus.value,
      },
    })

    orders.value = response.orders
  }
  catch {
    errorMessage.value = 'Не вдалося завантажити замовлення. Спробуй ще раз.'
  }
  finally {
    isLoading.value = false
  }
}

watch(selectedStatus, loadOrders)
onMounted(loadOrders)

useSeoMeta({
  title: 'Замовлення — адмін-панель',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <main class="admin-orders">
    <header class="admin-orders__heading">
      <div>
        <p>Адмін-панель</p>
        <h1>Замовлення</h1>
      </div>

      <button type="button" :disabled="isLoading" @click="loadOrders">
        Оновити
      </button>
    </header>

    <div class="admin-orders__toolbar">
      <label>
        <span>Статус</span>
        <select v-model="selectedStatus">
          <option value="all">Усі замовлення</option>
          <option
            v-for="option in ORDER_STATUS_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <span>{{ orders.length }} замовлень</span>
    </div>

    <div v-if="isLoading" class="admin-orders__state" aria-live="polite">
      <span class="admin-orders__spinner" aria-hidden="true" />
      Завантажуємо замовлення…
    </div>

    <div v-else-if="errorMessage" class="admin-orders__state admin-orders__state--error">
      <p role="alert">{{ errorMessage }}</p>
      <button type="button" @click="loadOrders">Спробувати ще раз</button>
    </div>

    <div v-else-if="orders.length === 0" class="admin-orders__state">
      <strong>Замовлень немає</strong>
      <p>Для обраного статусу поки що нічого немає.</p>
    </div>

    <ul v-else class="admin-orders__list">
      <li v-for="order in orders" :key="order.id">
        <NuxtLink :to="`/admin/orders/${order.id}`">
          <div class="admin-order__top">
            <div>
              <strong>{{ order.orderNumber }}</strong>
              <time :datetime="order.createdAt">{{ formatAdminDate(order.createdAt) }}</time>
            </div>
            <AdminOrderStatus :status="order.status" />
          </div>

          <div class="admin-order__customer">
            <strong>{{ order.customerName }}</strong>
            <span>{{ order.customerPhone }}</span>
          </div>

          <dl>
            <div>
              <dt>Отримання</dt>
              <dd>{{ getFulfillmentLabel(order.fulfillmentType) }}</dd>
            </div>
            <div>
              <dt>Вага</dt>
              <dd>{{ formatWeight(order.totalWeight) }}</dd>
            </div>
            <div>
              <dt>Сума</dt>
              <dd>{{ formatPrice(order.totalPrice) }}</dd>
            </div>
          </dl>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.admin-orders {
  width: min(100%, 1080px);
  min-height: calc(100dvh - 68px);
  margin: 0 auto;
  padding: 28px var(--page-padding) 48px;
}

.admin-orders__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
}

.admin-orders__heading p {
  margin-bottom: 4px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-orders__heading h1 {
  font-size: 30px;
}

.admin-orders__heading button,
.admin-orders__state button {
  min-height: 42px;
  padding: 0 15px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
}

.admin-orders__heading button:disabled {
  cursor: wait;
  opacity: 0.55;
}

.admin-orders__toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin: 24px 0 16px;
}

.admin-orders__toolbar label {
  display: grid;
  gap: 6px;
}

.admin-orders__toolbar label span,
.admin-orders__toolbar > span {
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
}

.admin-orders__toolbar select {
  width: min(62vw, 230px);
  height: 44px;
  padding: 0 36px 0 13px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  outline: none;
  font-size: 13px;
  font-weight: 700;
}

.admin-orders__toolbar select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgb(255 116 87 / 14%);
}

.admin-orders__list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.admin-orders__list a {
  display: grid;
  gap: 18px;
  padding: 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 5px 16px rgb(23 25 28 / 5%);
  transition: border-color var(--transition-fast), transform var(--transition-fast);
}

.admin-orders__list a:hover {
  border-color: #d3d9e2;
  transform: translateY(-1px);
}

.admin-orders__list a:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 2px;
}

.admin-order__top,
.admin-order__customer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.admin-order__top > div,
.admin-order__customer {
  min-width: 0;
}

.admin-order__top > div {
  display: grid;
  gap: 3px;
}

.admin-order__top strong {
  font-size: 15px;
}

.admin-order__top time,
.admin-order__customer span {
  color: var(--color-text-muted);
  font-size: 11px;
}

.admin-order__customer strong {
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-order__customer span {
  flex: 0 0 auto;
}

.admin-order__top + .admin-order__customer {
  margin-top: -7px;
}

.admin-orders dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
}

.admin-orders dl > div {
  display: grid;
  gap: 4px;
}

.admin-orders dt {
  color: var(--color-text-muted);
  font-size: 10px;
}

.admin-orders dd {
  margin: 0;
  font-size: 12px;
  font-weight: 800;
}

.admin-orders dl > div:last-child {
  text-align: right;
}

.admin-orders__state {
  display: grid;
  min-height: 280px;
  place-items: center;
  align-content: center;
  gap: 9px;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: 13px;
  text-align: center;
}

.admin-orders__state strong {
  color: var(--color-text);
  font-size: 17px;
}

.admin-orders__state--error p {
  color: #b42318;
}

.admin-orders__spinner {
  width: 26px;
  height: 26px;
  border: 3px solid rgb(255 116 87 / 18%);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: admin-orders-spin 700ms linear infinite;
}

@keyframes admin-orders-spin {
  to { transform: rotate(360deg); }
}

@media (min-width: 680px) {
  .admin-orders {
    padding-top: 40px;
  }

  .admin-orders__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
