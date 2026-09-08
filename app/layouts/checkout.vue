<script setup lang="ts">
const { totalItems } = useCart()
const checkoutStep = useState<2 | 3>('checkout-step', () => 2)
const isDeliveryDialogOpen = ref(false)

const hasStickyCheckout = computed(() => {
  return checkoutStep.value === 2 && totalItems.value > 0
})
</script>

<template>
  <div class="checkout-layout">
    <header class="checkout-header">
      <div class="checkout-header__top">
        <NuxtLink class="checkout-header__logo" to="/" aria-label="ROLLIN’ — на головну">
          <img src="/images/brand/brand-logo.png" alt="ROLLIN’">
        </NuxtLink>
      </div>
    </header>

    <nav class="checkout-progress" aria-label="Етапи оформлення замовлення">
      <ol>
        <li class="checkout-progress__step checkout-progress__step--complete">
          <NuxtLink to="/cart" aria-label="Повернутися до першого етапу: кошик">
            <svg class="checkout-progress__back-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="m14 6-6 6 6 6" />
            </svg>
            <span class="checkout-progress__number">1</span>
            <span class="checkout-progress__label">Кошик</span>
          </NuxtLink>
        </li>

        <li
          class="checkout-progress__step"
          :class="{
            'checkout-progress__step--active': checkoutStep === 2,
            'checkout-progress__step--complete': checkoutStep === 3,
          }"
        >
          <div :aria-current="checkoutStep === 2 ? 'step' : undefined">
            <span class="checkout-progress__number">2</span>
            <span class="checkout-progress__label">Оформлення</span>
          </div>
        </li>

        <li
          class="checkout-progress__step"
          :class="{ 'checkout-progress__step--active': checkoutStep === 3 }"
        >
          <div :aria-current="checkoutStep === 3 ? 'step' : undefined">
            <span class="checkout-progress__number">3</span>
            <span class="checkout-progress__label">Готово</span>
          </div>
        </li>
      </ol>
    </nav>

    <slot />

    <DeliveryDialog v-model="isDeliveryDialogOpen" />

    <AppFooter
      :class="{
        'app-footer--with-sticky-order-checkout': hasStickyCheckout,
      }"
      @open-delivery="isDeliveryDialogOpen = true"
    />
  </div>
</template>

<style scoped>
.checkout-layout {
  width: 100%;
  min-height: 100dvh;
  margin: 0 auto;
  background: var(--color-surface);
}

.checkout-header {
  position: relative;
  padding: 9px var(--page-padding) 5px;
  background: var(--color-surface);
}

.checkout-header__top {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
}

.checkout-header__logo:focus-visible,
.checkout-progress a:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 3px;
}

.checkout-header__logo {
  display: grid;
  width: 60px;
  height: 48px;
  place-items: center;
}

.checkout-header__logo img {
  width: 58px;
  height: 42px;
  object-fit: contain;
}

.checkout-progress {
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 7px var(--page-padding) 12px;
  background: rgb(255 255 255 / 94%);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(14px);
}

.checkout-progress ol {
  display: grid;
  grid-template-columns: 1fr 1.35fr 0.8fr;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.checkout-progress__back-icon {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.checkout-progress__step > a,
.checkout-progress__step > div {
  display: flex;
  min-width: 0;
  height: 42px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 7px;
  color: var(--color-text-muted);
  border: 1px solid transparent;
  border-radius: 999px;
}

.checkout-progress__number {
  display: grid;
  flex: 0 0 auto;
  width: 25px;
  height: 25px;
  place-items: center;
  background: var(--color-surface-soft);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 800;
}

.checkout-progress__label {
  min-width: 0;
  overflow: hidden;
  font-size: 10px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout-progress__step--complete > a,
.checkout-progress__step--complete > div {
  color: var(--color-text-secondary);
}

.checkout-progress__step--complete .checkout-progress__number {
  color: var(--color-text-secondary);
  background: var(--color-border);
}

.checkout-progress__step--active > div {
  color: var(--color-text);
  background: var(--color-surface);
  border-color: var(--color-border);
  box-shadow: 0 7px 20px rgb(23 25 28 / 9%);
}

.checkout-progress__step--active .checkout-progress__number {
  color: white;
  background: var(--color-text);
}

@media (max-width: 359px) {
  .checkout-header {
    padding-right: 14px;
    padding-left: 14px;
  }

  .checkout-progress {
    padding-right: 14px;
    padding-left: 14px;
  }

  .checkout-progress__step > a,
  .checkout-progress__step > div {
    gap: 4px;
    padding: 0 4px;
  }

  .checkout-progress__label {
    font-size: 9px;
  }
}

@media (min-width: 768px) {
  .checkout-layout {
    max-width: 430px;
    box-shadow: var(--shadow-page);
  }
}
</style>
