<script setup lang="ts">
import {
  formatPrice,
  formatWeight,
  getCartUnitsLabel,
} from '~/utils/formatters'

const {
  cartItems,
  totalItems,
  totalPrice,
  totalWeight,
  isEmpty,
  isReady,
} = useCart()

const cartSummary = ref<HTMLElement | null>(null)
const checkoutAction = ref<HTMLElement | null>(null)
const isCheckoutActionVisible = ref(false)
const hasCheckoutPosition = ref(false)
const shouldShowStickyCheckout = computed(() => {
  return isReady.value
    && !isEmpty.value
    && hasCheckoutPosition.value
    && !isCheckoutActionVisible.value
})

let checkoutObserver: IntersectionObserver | undefined

function updateCheckoutActionVisibility(element = checkoutAction.value) {
  if (!element) {
    hasCheckoutPosition.value = false
    return
  }

  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight

  isCheckoutActionVisible.value = rect.top < viewportHeight && rect.bottom > 0
  hasCheckoutPosition.value = true
}

function handleViewportResize() {
  updateCheckoutActionVisibility()
}

function scrollToSummary() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  cartSummary.value?.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}

function observeCheckoutAction(element: HTMLElement | null) {
  if (!checkoutObserver || !element) {
    return
  }

  checkoutObserver.observe(element)
  updateCheckoutActionVisibility(element)
}

onMounted(() => {
  checkoutObserver = new IntersectionObserver(([entry]) => {
    if (!entry) {
      return
    }

    isCheckoutActionVisible.value = entry.isIntersecting
    hasCheckoutPosition.value = true
  }, { threshold: 0.01 })

  observeCheckoutAction(checkoutAction.value)
  window.addEventListener('resize', handleViewportResize)
})

watch(
  checkoutAction,
  (element, previousElement) => {
    if (previousElement) {
      checkoutObserver?.unobserve(previousElement)
    }

    hasCheckoutPosition.value = false
    observeCheckoutAction(element)
  },
  { flush: 'post' },
)

onBeforeUnmount(() => {
  checkoutObserver?.disconnect()
  window.removeEventListener('resize', handleViewportResize)
})

useSeoMeta({
  title: 'Кошик — ROLLIN’',
  description: 'Переглянь вибрані роли та підготуй замовлення в ROLLIN’.',
  robots: 'noindex, follow',
})
</script>

<template>
  <main class="cart-page">
    <header class="cart-page__header">
      <h1>Кошик</h1>
    </header>

    <div v-if="!isReady" class="cart-page__loading" aria-live="polite">
      <span class="cart-page__loading-spinner" aria-hidden="true" />
      <p>Завантажується…</p>
    </div>

    <template v-else-if="!isEmpty">
      <section class="cart-page__items" aria-labelledby="cart-items-title">
        <h2 id="cart-items-title">Товари</h2>

        <ul class="cart-page__list">
          <CartItemCard
            v-for="item in cartItems"
            :key="item.product.id"
            :item="item"
          />
        </ul>
      </section>

      <section
        ref="cartSummary"
        class="cart-page__summary"
        aria-labelledby="cart-summary-title"
      >
        <h2 id="cart-summary-title">Разом</h2>

        <dl>
          <div>
            <dt>Кількість</dt>
            <dd>{{ totalItems }} {{ getCartUnitsLabel(totalItems) }}</dd>
          </div>

          <div>
            <dt>Загальна вага</dt>
            <dd>{{ formatWeight(totalWeight) }}</dd>
          </div>

          <div class="cart-page__summary-total">
            <dt>До сплати</dt>
            <dd>{{ formatPrice(totalPrice) }}</dd>
          </div>
        </dl>

        <div ref="checkoutAction">
          <VBtn
            to="/checkout"
            color="primary"
            variant="flat"
            block
          >
            Оформити замовлення
          </VBtn>
        </div>

        <p>Контактні дані та спосіб оплати заповнимо на наступному кроці.</p>
      </section>
    </template>

    <section v-else class="cart-page__empty">
      <div class="cart-page__empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="17" cy="20" r="1" />
        </svg>
      </div>

      <h2>Кошик порожній</h2>
      <p>Обери роли з меню, і вони з’являться тут.</p>

      <VBtn
        to="/menu"
        color="primary"
        variant="flat"
      >
        Перейти до меню
      </VBtn>
    </section>

    <Transition name="cart-sticky-checkout">
      <aside
        v-if="shouldShowStickyCheckout"
        class="cart-page__sticky-checkout"
        aria-label="Швидкий перехід до підсумку замовлення"
      >
        <VBtn
          type="button"
          color="primary"
          variant="flat"
          block
          :aria-label="`Перейти до підсумку, до сплати ${formatPrice(totalPrice)}`"
          @click="scrollToSummary"
        >
          <span>До оформлення</span>
          <strong>{{ formatPrice(totalPrice) }}</strong>
        </VBtn>
      </aside>
    </Transition>

  </main>
</template>

<style scoped>
.cart-page {
  min-height: 100dvh;
  padding: 20px var(--page-padding) 44px;
}

.cart-page__header {
  display: grid;
  gap: 8px;
  margin-bottom: 26px;
}

.cart-page__loading {
  display: grid;
  min-height: 280px;
  place-items: center;
  align-content: center;
  gap: 14px;
  color: var(--color-text-muted);
}

.cart-page__loading p {
  font-size: 13px;
  font-weight: 600;
}

.cart-page__loading-spinner {
  width: 34px;
  height: 34px;

  border: 3px solid rgb(255 116 87 / 18%);
  border-top-color: var(--color-primary);
  border-radius: 50%;

  animation: cart-loading-spin 700ms linear infinite;
}

@keyframes cart-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.cart-page__items,
.cart-page__summary,
.cart-page__empty {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-card);
}

.cart-page__items {
  padding: 18px;
}

.cart-page__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cart-page__summary {
  margin-top: 18px;
  padding: 20px;
  scroll-margin-top: 84px;
}

.cart-page__summary dl {
  display: grid;
  gap: 13px;
  margin: 18px 0 20px;
}

.cart-page__summary dl > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.cart-page__summary dt {
  color: var(--color-text-secondary);
  font-size: 13px;
}

.cart-page__summary dd {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.cart-page__summary .cart-page__summary-total {
  position: relative;
  margin-top: 3px;
  padding-top: 22px;
}

.cart-page__summary-total::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;

  height: 9px;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='9' viewBox='0 0 24 9'%3E%3Cpath d='M0 1.5 6 7.5 12 1.5 18 7.5 24 1.5' fill='none' stroke='%23e9edf2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-position: left center;
  background-size: 24px 9px;
}

.cart-page__summary-total dt {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 800;
}

.cart-page__summary-total dd {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.cart-page__summary :deep(.v-btn) {
  height: 50px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.cart-page__summary > p {
  margin-top: 10px;
  color: var(--color-text-muted);
  font-size: 10px;
  line-height: 1.4;
  text-align: center;
}

.cart-page__sticky-checkout {
  position: fixed;
  right: 12px;
  bottom: max(12px, env(safe-area-inset-bottom));
  left: 12px;
  z-index: 30;

  width: min(calc(100% - 24px), 406px);
  margin: 0 auto;
  padding: 6px;

  background: rgb(255 255 255 / 88%);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgb(23 25 28 / 12%);
  backdrop-filter: blur(12px);
}

.cart-page__sticky-checkout :deep(.v-btn) {
  height: 52px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.cart-page__sticky-checkout :deep(.v-btn__content) {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.cart-page__sticky-checkout strong {
  font-size: 16px;
}

.cart-sticky-checkout-enter-active,
.cart-sticky-checkout-leave-active {
  transition:
    opacity 180ms ease,
    translate 220ms ease;
}

.cart-sticky-checkout-enter-from,
.cart-sticky-checkout-leave-to {
  opacity: 0;
  translate: 0 calc(100% + 16px);
}

.cart-page__empty {
  display: grid;
  min-height: 340px;
  justify-items: center;
  align-content: center;
  padding: 36px 24px;
  text-align: center;
}

.cart-page__empty-icon {
  display: grid;
  width: 72px;
  height: 72px;
  margin-bottom: 18px;
  place-items: center;
  color: var(--color-primary);
  background: rgb(255 116 87 / 10%);
  border-radius: 22px;
}

.cart-page__empty-icon svg {
  width: 32px;
  height: 32px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.cart-page__empty > p {
  margin: 8px 0 20px;
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.5;
}

.cart-page__empty :deep(.v-btn) {
  height: 46px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

@media (max-width: 359px) {
  .cart-page {
    padding-right: 14px;
    padding-left: 14px;
  }

  .cart-page__items {
    padding: 15px;
  }

}

@media (min-width: 768px) {
  .cart-page__sticky-checkout {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cart-sticky-checkout-enter-active,
  .cart-sticky-checkout-leave-active {
    transition: none;
  }
}
</style>
