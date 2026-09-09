<script setup lang="ts">
import type {
  CheckoutFormData,
  CreateOrderPayload,
  CreateOrderResponse,
} from '~/types/order'
import {
  formatPrice,
  formatWeight,
  getCartUnitsLabel,
} from '~/utils/formatters'

definePageMeta({
  layout: 'checkout',
})

type CheckoutErrorKey = 'name' | 'phone' | 'street' | 'house' | 'scheduledTime'

const {
  cartItems,
  totalItems,
  totalPrice,
  totalWeight,
  isEmpty,
  isReady,
  clearCart,
} = useCart()

const checkoutForm = ref<HTMLFormElement | null>(null)
const isSubmitting = ref(false)
const submitError = ref('')
const submittedOrder = ref<CreateOrderResponse | null>(null)
const errors = reactive<Partial<Record<CheckoutErrorKey, string>>>({})
const checkoutStep = useState<2 | 3>('checkout-step', () => 2)

const form = reactive<CheckoutFormData>({
  name: '',
  phone: '',
  fulfillment: 'delivery',
  street: '',
  house: '',
  apartment: '',
  entrance: '',
  floor: '',
  deliveryTimeType: 'asap',
  scheduledTime: '',
  paymentMethod: 'cash',
  comment: '',
})

const phonePattern = /^\+?[\d\s()-]{10,20}$/
const availableTimes = Array.from({ length: 24 }, (_, index) => {
  const totalMinutes = 10 * 60 + index * 30
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0')
  const minutes = (totalMinutes % 60).toString().padStart(2, '0')

  return `${hours}:${minutes}`
})

function clearError(field: CheckoutErrorKey) {
  delete errors[field]
  submitError.value = ''
}

function validateForm() {
  for (const field of Object.keys(errors) as CheckoutErrorKey[]) {
    delete errors[field]
  }

  if (!form.name.trim()) {
    errors.name = 'Вкажи ім’я отримувача'
  }

  if (!phonePattern.test(form.phone.trim())) {
    errors.phone = 'Вкажи коректний номер телефону'
  }

  if (form.fulfillment === 'delivery') {
    if (!form.street.trim()) {
      errors.street = 'Вкажи вулицю'
    }

    if (!form.house.trim()) {
      errors.house = 'Вкажи номер будинку'
    }
  }

  if (form.deliveryTimeType === 'scheduled' && !form.scheduledTime) {
    errors.scheduledTime = 'Обери бажаний час'
  }

  return Object.keys(errors).length === 0
}

function createOrderPayload(): CreateOrderPayload {
  return {
    customer: {
      name: form.name.trim(),
      phone: form.phone.trim(),
    },
    fulfillment: form.fulfillment === 'delivery'
      ? {
          type: 'delivery',
          address: {
            street: form.street.trim(),
            house: form.house.trim(),
            apartment: form.apartment.trim() || undefined,
            entrance: form.entrance.trim() || undefined,
            floor: form.floor.trim() || undefined,
          },
        }
      : { type: 'pickup' },
    deliveryTime: form.deliveryTimeType === 'scheduled'
      ? { type: 'scheduled', time: form.scheduledTime }
      : { type: 'asap' },
    paymentMethod: form.paymentMethod,
    comment: form.comment.trim() || undefined,
    items: cartItems.value.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  }
}

function getSubmitError(error: unknown) {
  if (
    typeof error === 'object'
    && error !== null
    && 'data' in error
    && typeof error.data === 'object'
    && error.data !== null
    && 'statusMessage' in error.data
    && typeof error.data.statusMessage === 'string'
  ) {
    return error.data.statusMessage
  }

  return 'Не вдалося створити замовлення. Спробуй ще раз.'
}

async function focusFirstError() {
  await nextTick()
  checkoutForm.value
    ?.querySelector<HTMLElement>('.v-input--error input')
    ?.focus()
}

async function submitOrder() {
  submitError.value = ''

  if (!validateForm()) {
    await focusFirstError()
    return
  }

  isSubmitting.value = true

  try {
    const order = await $fetch<CreateOrderResponse>('/api/orders', {
      method: 'POST',
      body: createOrderPayload(),
    })

    submittedOrder.value = order
    checkoutStep.value = 3
    clearCart()

    await nextTick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  catch (error) {
    submitError.value = getSubmitError(error)
  }
  finally {
    isSubmitting.value = false
  }
}

onBeforeMount(() => {
  checkoutStep.value = 2
})

useSeoMeta({
  title: 'Оформлення замовлення — ROLLIN’',
  description: 'Вкажи контактні дані, спосіб отримання та оплати замовлення ROLLIN’.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <main class="checkout-page">
    <section v-if="submittedOrder" class="checkout-page__result" aria-labelledby="order-result-title">
      <div class="checkout-page__result-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m5 12 4 4L19 6" />
        </svg>
      </div>

      <p class="checkout-page__eyebrow">Замовлення оформлено</p>
      <h1 id="order-result-title">Замовлення прийнято</h1>
      <p>
        Номер замовлення
        <strong>{{ submittedOrder.orderNumber }}</strong>
      </p>
      <p class="checkout-page__result-note">
        Ми отримали твоє замовлення. Очікуй підтвердження від менеджера.
      </p>

      <VBtn to="/menu" color="primary" variant="flat" block>
        Повернутися до меню
      </VBtn>
    </section>

    <div v-else-if="!isReady" class="checkout-page__loading" aria-live="polite">
      <span class="checkout-page__loading-spinner" aria-hidden="true" />
      <p>Завантажується…</p>
    </div>

    <section v-else-if="isEmpty" class="checkout-page__empty">
      <h1>Кошик порожній</h1>
      <p>Додай товари до кошика, перш ніж переходити до оформлення.</p>
      <VBtn to="/menu" color="primary" variant="flat">
        Перейти до меню
      </VBtn>
    </section>

    <template v-else>
      <header class="checkout-page__header">
        <h1>Оформлення замовлення</h1>
      </header>

      <VDefaultsProvider
        :defaults="{
          VTextField: {
            density: 'compact',
            hideDetails: false,
          },
          VTextarea: {
            density: 'compact',
            hideDetails: 'auto',
          },
          VSelect: {
            density: 'compact',
            hideDetails: false,
          },
        }"
      >
        <form
          id="checkout-form"
          ref="checkoutForm"
          class="checkout-page__form"
          novalidate
          @submit.prevent="submitOrder"
        >
          <section class="checkout-card" aria-labelledby="customer-title">
          <h2 id="customer-title">Контактні дані</h2>

          <div class="checkout-card__fields">
            <VTextField
              v-model="form.name"
              label="Ім’я"
              autocomplete="name"
              variant="outlined"
              :error-messages="errors.name"
              @update:model-value="clearError('name')"
            />

            <VTextField
              v-model="form.phone"
              label="Номер телефону"
              placeholder="+380 00 000 00 00"
              autocomplete="tel"
              inputmode="tel"
              variant="outlined"
              :error-messages="errors.phone"
              @update:model-value="clearError('phone')"
            />
          </div>
          </section>

          <section class="checkout-card" aria-labelledby="fulfillment-title">
          <h2 id="fulfillment-title">Як отримаєш замовлення?</h2>

          <VBtnToggle
            v-model="form.fulfillment"
            class="checkout-page__toggle"
            color="primary"
            mandatory
          >
            <VBtn value="delivery">Доставка</VBtn>
            <VBtn value="pickup">Самовивіз</VBtn>
          </VBtnToggle>

          <div v-if="form.fulfillment === 'delivery'" class="checkout-card__address">
            <VTextField
              v-model="form.street"
              label="Вулиця"
              autocomplete="address-line1"
              variant="outlined"
              :error-messages="errors.street"
              @update:model-value="clearError('street')"
            />

            <div class="checkout-card__address-row">
              <VTextField
                v-model="form.house"
                label="Будинок"
                autocomplete="address-line2"
                variant="outlined"
                :error-messages="errors.house"
                @update:model-value="clearError('house')"
              />
              <VTextField v-model="form.apartment" label="Квартира" variant="outlined" />
            </div>

            <div class="checkout-card__address-row checkout-card__address-row--optional">
              <VTextField v-model="form.entrance" label="Під’їзд" variant="outlined" />
              <VTextField v-model="form.floor" label="Поверх" variant="outlined" />
            </div>
          </div>

          <div v-else class="checkout-page__pickup-info">
            <strong>Самовивіз із ROLLIN’</strong>
            <p>Точну адресу та готовність замовлення підтвердить менеджер.</p>
          </div>
          </section>

          <section class="checkout-card" aria-labelledby="time-title">
          <h2 id="time-title">Коли приготувати?</h2>

          <VBtnToggle
            v-model="form.deliveryTimeType"
            class="checkout-page__toggle"
            color="primary"
            mandatory
          >
            <VBtn value="asap">Якнайшвидше</VBtn>
            <VBtn value="scheduled">На певний час</VBtn>
          </VBtnToggle>

          <VSelect
            v-if="form.deliveryTimeType === 'scheduled'"
            v-model="form.scheduledTime"
            class="checkout-page__time-field"
            label="Бажаний час"
            placeholder="Обрати час"
            variant="outlined"
            :items="availableTimes"
            :menu-props="{ maxHeight: 260 }"
            :error-messages="errors.scheduledTime"
            @update:model-value="clearError('scheduledTime')"
          >
            <template #append-inner>
              <svg class="checkout-page__select-icon" aria-hidden="true" viewBox="0 0 20 20">
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </template>
          </VSelect>
          </section>

          <section class="checkout-card" aria-labelledby="payment-title">
          <h2 id="payment-title">Оплата</h2>

          <VItemGroup
            v-model="form.paymentMethod"
            class="checkout-page__payment-options"
            mandatory
            role="radiogroup"
          >
            <VItem v-slot="{ isSelected, toggle }" value="cash">
              <VBtn
                type="button"
                variant="outlined"
                role="radio"
                :aria-checked="isSelected"
                :class="{ 'checkout-page__payment-option--active': isSelected }"
                @click="toggle"
              >
                <span class="checkout-page__payment-indicator" aria-hidden="true" />
                <span class="checkout-page__radio-label">
                  <strong>Готівкою</strong>
                  <small>Під час отримання замовлення</small>
                </span>
              </VBtn>
            </VItem>

            <VItem v-slot="{ isSelected, toggle }" value="card-on-delivery">
              <VBtn
                type="button"
                variant="outlined"
                role="radio"
                :aria-checked="isSelected"
                :class="{ 'checkout-page__payment-option--active': isSelected }"
                @click="toggle"
              >
                <span class="checkout-page__payment-indicator" aria-hidden="true" />
                <span class="checkout-page__radio-label">
                  <strong>Карткою</strong>
                  <small>Через термінал під час отримання</small>
                </span>
              </VBtn>
            </VItem>
          </VItemGroup>
          </section>

          <section class="checkout-card" aria-labelledby="comment-title">
          <h2 id="comment-title">Коментар</h2>
          <VTextarea
            v-model="form.comment"
            label="Побажання до замовлення"
            placeholder="Наприклад, не телефонуйте у двері"
            variant="outlined"
            rows="3"
            maxlength="300"
            counter
          />
          </section>

          <section class="checkout-card checkout-card--order" aria-labelledby="order-title">
          <div class="checkout-card__heading">
            <h2 id="order-title">Твоє замовлення</h2>
            <NuxtLink to="/cart">Змінити</NuxtLink>
          </div>

          <ul class="checkout-page__items">
            <li v-for="item in cartItems" :key="item.product.id">
              <span>{{ item.product.name }} × {{ item.quantity }}</span>
              <strong>{{ formatPrice(item.totalPrice) }}</strong>
            </li>
          </ul>

          <dl class="checkout-page__summary">
            <div>
              <dt>Кількість</dt>
              <dd>{{ totalItems }} {{ getCartUnitsLabel(totalItems) }}</dd>
            </div>
            <div>
              <dt>Загальна вага</dt>
              <dd>{{ formatWeight(totalWeight) }}</dd>
            </div>
            <div>
              <dt>Доставка</dt>
              <dd>{{ form.fulfillment === 'pickup' ? 'Безкоштовно' : 'Уточнить менеджер' }}</dd>
            </div>
            <div class="checkout-page__summary-total">
              <dt>Попередньо до сплати</dt>
              <dd>{{ formatPrice(totalPrice) }}</dd>
            </div>
          </dl>
          </section>

          <p v-if="submitError" class="checkout-page__submit-error" role="alert">
            {{ submitError }}
          </p>
        </form>
      </VDefaultsProvider>

      <aside class="checkout-page__sticky-action" aria-label="Підтвердження замовлення">
        <div>
          <small>Попередньо</small>
          <strong>{{ formatPrice(totalPrice) }}</strong>
        </div>

        <VBtn
          type="submit"
          form="checkout-form"
          color="primary"
          variant="flat"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Підтвердити
        </VBtn>
      </aside>
    </template>
  </main>
</template>

<style scoped>
.checkout-page {
  min-height: 100dvh;
  padding: 20px var(--page-padding) 44px;
}

.checkout-page__header {
  margin-bottom: 18px;
}

.checkout-page__eyebrow {
  margin-bottom: 7px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.checkout-page__form {
  display: grid;
  gap: 14px;
}

.checkout-card,
.checkout-page__result,
.checkout-page__empty {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-card);
}

.checkout-card {
  padding: 19px;
}

.checkout-card h2 {
  margin-bottom: 14px;
  font-size: 18px;
}

.checkout-card__fields,
.checkout-card__address {
  display: grid;
  row-gap: 6px;
}

.checkout-card__address {
  margin-top: 14px;
}

.checkout-card__address-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
}

.checkout-page :deep(.v-field) {
  border-radius: 14px;
}

.checkout-page :deep(.v-field__input) {
  font-size: 14px;
}

.checkout-page :deep(.v-input__details) {
  min-height: 14px;
  padding-top: 2px;
}

.checkout-page :deep(.v-messages__message) {
  font-size: 10px;
  line-height: 1.2;
}

.checkout-page__toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: auto;
  padding: 5px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.checkout-page__toggle :deep(.v-btn) {
  width: 100%;
  height: 52px;
  padding: 0 8px;
  border-radius: 13px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.checkout-page__toggle :deep(.v-btn--active) {
  color: white;
}

.checkout-page__pickup-info {
  margin-top: 18px;
  padding: 15px;
  background: var(--color-surface-soft);
  border-radius: 14px;
}

.checkout-page__pickup-info strong {
  font-size: 13px;
}

.checkout-page__pickup-info p {
  margin-top: 5px;
  color: var(--color-text-secondary);
  font-size: 11px;
  line-height: 1.45;
}

.checkout-page__time-field {
  margin-top: 14px;
}

.checkout-page__select-icon {
  width: 18px;
  height: 18px;
  pointer-events: none;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.checkout-page__radio-label {
  display: grid;
  gap: 2px;
  min-width: 0;
  text-align: left;
}

.checkout-page__radio-label strong {
  color: var(--color-text);
  font-size: 13px;
}

.checkout-page__radio-label small {
  color: var(--color-text-muted);
  font-size: 10px;
}

.checkout-page__payment-options {
  display: grid;
  width: 100%;
  height: auto;
  gap: 9px;
  overflow: visible;
  background: transparent;
  border-radius: 0;
}

.checkout-page__payment-options :deep(.v-btn) {
  width: 100%;
  min-height: 62px;
  padding: 10px 13px;
  justify-content: flex-start;
  color: var(--color-text);
  background: var(--color-surface);
  border-color: var(--color-border);
  border-radius: 14px;
  letter-spacing: 0;
  text-transform: none;
}

.checkout-page__payment-options :deep(.v-btn__content) {
  width: 100%;
  justify-content: flex-start;
  gap: 11px;
  white-space: normal;
}

.checkout-page__payment-options :deep(.checkout-page__payment-option--active) {
  background: rgb(255 116 87 / 7%);
  border-color: var(--color-primary);
  box-shadow: inset 0 0 0 1px var(--color-primary);
}

.checkout-page__payment-indicator {
  position: relative;
  display: block;
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
}

.checkout-page__payment-indicator::after {
  content: '';
  position: absolute;
  inset: 4px;
  background: var(--color-primary);
  border-radius: 50%;
  transform: scale(0);
  transition: transform var(--transition-fast);
}

.checkout-page__payment-options :deep(.checkout-page__payment-option--active) .checkout-page__payment-indicator {
  border-color: var(--color-primary);
}

.checkout-page__payment-options :deep(.checkout-page__payment-option--active) .checkout-page__payment-indicator::after {
  transform: scale(1);
}

.checkout-card__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.checkout-card__heading h2 {
  margin-bottom: 0;
}

.checkout-card__heading a {
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 800;
}

.checkout-page__items {
  display: grid;
  gap: 10px;
  margin: 17px 0 0;
  padding: 0 0 17px;
  border-bottom: 1px solid var(--color-border);
  list-style: none;
}

.checkout-page__items li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.checkout-page__items strong {
  color: var(--color-text);
  white-space: nowrap;
}

.checkout-page__summary {
  display: grid;
  gap: 11px;
  margin: 17px 0 0;
}

.checkout-page__summary > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.checkout-page__summary dt,
.checkout-page__summary dd {
  font-size: 12px;
}

.checkout-page__summary dt {
  color: var(--color-text-secondary);
}

.checkout-page__summary dd {
  margin: 0;
  font-weight: 700;
  text-align: right;
}

.checkout-page__summary-total {
  margin-top: 4px;
  padding-top: 15px;
  border-top: 1px dashed var(--color-border);
}

.checkout-page__summary-total dt {
  color: var(--color-text);
  font-size: 14px;
  font-weight: 800;
}

.checkout-page__summary-total dd {
  font-size: 20px;
  font-weight: 800;
}

.checkout-page__submit-error {
  padding: 12px 14px;
  color: #b42318;
  background: #fff0ed;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
}

.checkout-page__sticky-action {
  position: fixed;
  right: 12px;
  bottom: max(12px, env(safe-area-inset-bottom));
  left: 12px;
  z-index: 30;

  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 14px;

  width: min(calc(100% - 24px), 406px);
  margin: 0 auto;
  padding: 7px;

  background: rgb(255 255 255 / 90%);
  border: 1px solid var(--color-border);
  border-radius: 19px;
  box-shadow: 0 10px 30px rgb(23 25 28 / 14%);
  backdrop-filter: blur(12px);
}

.checkout-page__sticky-action > div {
  display: grid;
  gap: 1px;
  padding-left: 8px;
}

.checkout-page__sticky-action small {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 700;
}

.checkout-page__sticky-action strong {
  font-size: 17px;
  white-space: nowrap;
}

.checkout-page__sticky-action :deep(.v-btn) {
  height: 52px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.checkout-page__loading {
  display: grid;
  min-height: 300px;
  place-items: center;
  align-content: center;
  gap: 14px;
  color: var(--color-text-muted);
}

.checkout-page__loading-spinner {
  width: 34px;
  height: 34px;
  border: 3px solid rgb(255 116 87 / 18%);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: checkout-loading-spin 700ms linear infinite;
}

@keyframes checkout-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.checkout-page__loading p {
  font-size: 13px;
  font-weight: 600;
}

.checkout-page__empty,
.checkout-page__result {
  display: grid;
  min-height: 360px;
  justify-items: center;
  align-content: center;
  padding: 34px 24px;
  text-align: center;
}

.checkout-page__empty > p,
.checkout-page__result > p:not(.checkout-page__eyebrow) {
  margin: 10px 0 20px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.checkout-page__result-icon {
  display: grid;
  width: 68px;
  height: 68px;
  margin-bottom: 18px;
  place-items: center;
  color: white;
  background: var(--color-primary);
  border-radius: 22px;
}

.checkout-page__result-icon svg {
  width: 34px;
  height: 34px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.2;
}

.checkout-page__result > p strong {
  display: block;
  margin-top: 3px;
  color: var(--color-text);
  font-size: 18px;
}

.checkout-page__result .checkout-page__result-note {
  margin-top: 0;
  color: var(--color-text-muted);
  font-size: 11px;
}

.checkout-page__result :deep(.v-btn),
.checkout-page__empty :deep(.v-btn) {
  height: 48px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

@media (max-width: 359px) {
  .checkout-page {
    padding-right: 14px;
    padding-left: 14px;
  }

  .checkout-card {
    padding: 16px;
  }

  .checkout-page__toggle :deep(.v-btn) {
    font-size: 11px;
  }
}

@media (min-width: 768px) {
  .checkout-page__sticky-action {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .checkout-page__loading-spinner {
    animation-duration: 1.4s;
  }
}
</style>
