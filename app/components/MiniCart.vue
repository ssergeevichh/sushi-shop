<script setup lang="ts">
import { products } from '~/data/products'

const isOpen = defineModel<boolean>({ default: false })

const route = useRoute()
const {
  totalItems,
  getQuantity,
  increase,
  decrease,
} = useCart()

const cartItems = computed(() => {
  return products.flatMap((product) => {
    const quantity = getQuantity(product.id)

    if (quantity === 0) {
      return []
    }

    return [{
      product,
      quantity,
      total: product.price * quantity,
      totalWeight: product.weight * quantity,
    }]
  })
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.total, 0)
})

function formatPrice(price: number) {
  return `${price.toLocaleString('uk-UA')} ₴`
}

function formatWeight(weight: number) {
  return `${weight.toLocaleString('uk-UA')} г`
}

function getItemsLabel(count: number) {
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'товарів'
  }

  const lastDigit = count % 10

  if (lastDigit === 1) {
    return 'товар'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'товари'
  }

  return 'товарів'
}

watch(
  () => route.fullPath,
  () => {
    isOpen.value = false
  },
)
</script>

<template>
  <VNavigationDrawer
    id="mini-cart"
    v-model="isOpen"
    class="mini-cart"
    location="right"
    :width="390"
    temporary
  >
    <header class="mini-cart__header">
      <div>
        <h2>Кошик</h2>
        <p>{{ totalItems }} {{ getItemsLabel(totalItems) }}</p>
      </div>

      <VBtn
        type="button"
        icon
        variant="text"
        aria-label="Закрити кошик"
        @click="isOpen = false"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </VBtn>
    </header>

    <div v-if="cartItems.length" class="mini-cart__body">
      <ul class="mini-cart__list">
        <li
          v-for="item in cartItems"
          :key="item.product.id"
          class="mini-cart__item"
        >
          <NuxtLink
            class="mini-cart__image"
            :to="`/products/${item.product.slug}`"
            :aria-label="`Відкрити ${item.product.name}`"
          >
            <VImg
              :src="item.product.image"
              :alt="item.product.name"
              :aspect-ratio="1"
              cover
            />
          </NuxtLink>

          <div class="mini-cart__item-content">
            <div class="mini-cart__item-heading">
              <div class="mini-cart__item-info">
                <NuxtLink :to="`/products/${item.product.slug}`">
                  {{ item.product.name }}
                </NuxtLink>

                <p>
                  {{ item.product.weight }} г
                  <template v-if="item.quantity > 1">
                    × {{ item.quantity }}
                  </template>
                </p>
              </div>

              <div class="mini-cart__item-totals">
                <strong>{{ formatPrice(item.total) }}</strong>
                <small v-if="item.quantity > 1">
                  {{ formatWeight(item.totalWeight) }} разом
                </small>
              </div>
            </div>

            <div
              class="mini-cart__quantity-controls"
              role="group"
              :aria-label="`Кількість ${item.product.name}`"
            >
              <VBtn
                type="button"
                icon
                variant="text"
                :aria-label="item.quantity === 1
                  ? `Видалити ${item.product.name} з кошика`
                  : `Зменшити кількість ${item.product.name}`"
                @click="decrease(item.product.id)"
              >
                <svg
                  v-if="item.quantity === 1"
                  class="mini-cart__trash-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
                </svg>

                <svg v-else aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                </svg>
              </VBtn>

              <output aria-live="polite">{{ item.quantity }}</output>

              <VBtn
                type="button"
                icon
                color="primary"
                variant="flat"
                :aria-label="`Збільшити кількість ${item.product.name}`"
                @click="increase(item.product.id)"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </VBtn>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-else class="mini-cart__empty">
      <div class="mini-cart__empty-icon">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="17" cy="20" r="1" />
        </svg>
      </div>

      <h3>Кошик порожній</h3>
      <p>Додай роли, які хочеш замовити.</p>

      <VBtn
        to="/"
        color="primary"
        variant="flat"
        @click="isOpen = false"
      >
        Перейти до меню
      </VBtn>
    </div>

    <footer v-if="cartItems.length" class="mini-cart__footer">
      <div class="mini-cart__total">
        <span>Разом</span>
        <strong>{{ formatPrice(totalPrice) }}</strong>
      </div>

      <VBtn
        type="button"
        color="primary"
        variant="flat"
        block
        @click="isOpen = false"
      >
        Продовжити покупки
      </VBtn>
    </footer>
  </VNavigationDrawer>
</template>

<style scoped>
.mini-cart {
  max-width: calc(100vw - 12px);
  color: var(--color-text);
  background: var(--color-surface);
}

.mini-cart :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}

.mini-cart__header {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 76px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--color-border);
}

.mini-cart__header h2 {
  margin: 0;
}

.mini-cart__header p {
  margin-top: 3px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 600;
}

.mini-cart__header :deep(.v-btn) {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 14px;
}

.mini-cart__header svg,
.mini-cart__quantity-controls svg,
.mini-cart__empty-icon svg {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.mini-cart__header svg {
  width: 21px;
  height: 21px;
}

.mini-cart__body {
  flex: 1 1 auto;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 8px 18px 24px;
}

.mini-cart__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.mini-cart__item {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.mini-cart__image {
  display: block;
  align-self: start;
  overflow: hidden;
  border-radius: 14px;
}

.mini-cart__item-content {
  min-width: 0;
}

.mini-cart__item-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.mini-cart__item-info {
  min-width: 0;
}

.mini-cart__item-heading a {
  display: block;
  overflow: hidden;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 800;
  line-height: 1.25;
  text-decoration: none;
  text-overflow: ellipsis;
}

.mini-cart__item-heading a:hover {
  color: var(--color-primary);
}

.mini-cart__item-info p {
  margin-top: 5px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 600;
}

.mini-cart__item-totals {
  display: grid;
  flex: 0 0 auto;
  gap: 3px;
  justify-items: end;
  text-align: right;
}

.mini-cart__item-totals strong {
  font-size: 13px;
  white-space: nowrap;
}

.mini-cart__item-totals small {
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

.mini-cart__quantity-controls {
  display: grid;
  grid-template-columns: 32px 32px 32px;
  align-items: center;
  width: max-content;
  margin-top: 10px;
  padding: 3px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.mini-cart__quantity-controls :deep(.v-btn) {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 9px;
}

.mini-cart__quantity-controls svg {
  width: 17px;
  height: 17px;
}

.mini-cart__trash-icon {
  color: var(--color-primary);
}

.mini-cart__quantity-controls output {
  font-size: 13px;
  font-weight: 800;
  text-align: center;
}

.mini-cart__empty {
  display: grid;
  flex: 1 1 auto;
  place-items: center;
  align-content: center;
  padding: 32px 24px;
  text-align: center;
}

.mini-cart__empty-icon {
  display: grid;
  width: 72px;
  height: 72px;
  margin-bottom: 18px;
  place-items: center;
  color: var(--color-primary);
  background: rgb(255 116 87 / 10%);
  border-radius: 22px;
}

.mini-cart__empty-icon svg {
  width: 32px;
  height: 32px;
}

.mini-cart__empty p {
  margin: 8px 0 20px;
  color: var(--color-text-muted);
  font-size: 14px;
}

.mini-cart__empty :deep(.v-btn),
.mini-cart__footer :deep(.v-btn) {
  height: 48px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.mini-cart__footer {
  flex: 0 0 auto;
  padding: 16px 18px max(16px, env(safe-area-inset-bottom));
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -8px 24px rgb(23 25 28 / 7%);
}

.mini-cart__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.mini-cart__total span {
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 700;
}

.mini-cart__total strong {
  font-size: 20px;
}

@media (max-width: 359px) {
  .mini-cart__header,
  .mini-cart__body,
  .mini-cart__footer {
    padding-right: 14px;
    padding-left: 14px;
  }

  .mini-cart__item {
    grid-template-columns: 72px minmax(0, 1fr);
  }
}
</style>
