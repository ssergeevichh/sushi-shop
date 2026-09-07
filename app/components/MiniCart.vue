<script setup lang="ts">
import {
  formatPrice,
  formatWeight,
  getCartUnitsLabel,
} from '~/utils/formatters'

const isOpen = defineModel<boolean>({ default: false })

const route = useRoute()
const {
  cartItems,
  totalItems,
  totalPrice,
  totalWeight,
} = useCart()

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
        <p>{{ totalItems }} {{ getCartUnitsLabel(totalItems) }}</p>
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
        <CartItemCard
          v-for="item in cartItems"
          :key="item.product.id"
          :item="item"
        />
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
        to="/menu"
        color="primary"
        variant="flat"
        @click="isOpen = false"
      >
        Перейти до меню
      </VBtn>
    </div>

    <footer v-if="cartItems.length" class="mini-cart__footer">
      <div class="mini-cart__total">
        <div>
          <span>Разом</span>
          <small>{{ formatWeight(totalWeight) }}</small>
        </div>
        <strong>{{ formatPrice(totalPrice) }}</strong>
      </div>

      <VBtn
        to="/cart"
        color="primary"
        variant="flat"
        block
        @click="isOpen = false"
      >
        Перейти до кошика
      </VBtn>

      <VBtn
        class="mini-cart__continue-button"
        type="button"
        variant="text"
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

.mini-cart__total > div {
  display: grid;
  gap: 2px;
}

.mini-cart__total span {
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 700;
}

.mini-cart__total small {
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 600;
}

.mini-cart__total strong {
  font-size: 20px;
}

.mini-cart__footer :deep(.mini-cart__continue-button.v-btn) {
  height: 40px;
  margin-top: 6px;
  color: var(--color-text-secondary);
}

@media (max-width: 359px) {
  .mini-cart__header,
  .mini-cart__body,
  .mini-cart__footer {
    padding-right: 14px;
    padding-left: 14px;
  }

}
</style>
