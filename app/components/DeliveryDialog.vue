<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false })
</script>

<template>
  <VDialog
    id="delivery-dialog"
    v-model="isOpen"
    class="delivery-dialog"
    :max-width="390"
  >
    <VCard class="delivery-dialog__card">
      <header class="delivery-dialog__header">
        <div class="delivery-dialog__brand">
          <h2>Доставка ROLLIN’</h2>
          <p>По місту та району</p>
        </div>

        <VBtn
          type="button"
          icon
          variant="text"
          aria-label="Закрити інформацію про доставку"
          @click="isOpen = false"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </VBtn>
      </header>

      <div class="delivery-dialog__body">
        <p class="delivery-dialog__intro">
          Доставляємо замовлення в межах міста та району.
          Можливість доставки за конкретною адресою підтвердить менеджер.
        </p>

        <dl class="delivery-dialog__details">
          <div>
            <dt>Графік</dt>
            <dd>Щодня, 10:00 — 22:00</dd>
          </div>
          <div>
            <dt>Час доставки</dt>
            <dd>Залежить від адреси та завантаження кухні</dd>
          </div>
          <div>
            <dt>Вартість</dt>
            <dd>Розраховується відповідно до зони доставки</dd>
          </div>
        </dl>

        <div class="delivery-dialog__note">
          Після оформлення замовлення менеджер зателефонує, уточнить адресу,
          вартість і орієнтовний час прибуття кур’єра.
        </div>
      </div>

      <footer class="delivery-dialog__actions">
        <VBtn
          href="tel:+380990000000"
          color="primary"
          variant="flat"
          block
        >
          Зателефонувати
        </VBtn>

        <div class="delivery-dialog__footer-row">
          <img
            src="/images/brand/delivery-logo.png"
            alt="ROLLIN’ Delivery"
          >

          <VBtn type="button" variant="text" @click="isOpen = false">
            Зрозуміло
          </VBtn>
        </div>
      </footer>
    </VCard>
  </VDialog>
</template>

<style scoped>
.delivery-dialog {
  margin: 14px;
}

.delivery-dialog__card {
  overflow: hidden;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgb(23 25 28 / 20%);
}

.delivery-dialog__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 40px;
  align-items: center;
  gap: 12px;
  padding: 17px 16px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.delivery-dialog__header h2 {
  font-size: 18px;
}

.delivery-dialog__header p {
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 600;
}

.delivery-dialog__header :deep(.v-btn) {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 13px;
}

.delivery-dialog__header :deep(.v-btn svg) {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.delivery-dialog__body {
  padding: 18px 17px;
}

.delivery-dialog__intro {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.55;
}

.delivery-dialog__details {
  display: grid;
  gap: 0;
  margin: 17px 0 0;
}

.delivery-dialog__details > div {
  display: grid;
  grid-template-columns: 105px minmax(0, 1fr);
  gap: 12px;
  padding: 11px 0;
  border-top: 1px solid var(--color-border);
}

.delivery-dialog__details dt,
.delivery-dialog__details dd {
  font-size: 11px;
  line-height: 1.4;
}

.delivery-dialog__details dt {
  color: var(--color-text-muted);
  font-weight: 700;
}

.delivery-dialog__details dd {
  margin: 0;
  color: var(--color-text);
  font-weight: 700;
}

.delivery-dialog__note {
  padding: 13px;
  color: var(--color-text-secondary);
  background: var(--color-surface-soft);
  border-radius: 13px;
  font-size: 10px;
  line-height: 1.5;
}

.delivery-dialog__actions {
  display: grid;
  gap: 4px;
  padding: 0 17px 17px;
}

.delivery-dialog__actions :deep(.v-btn) {
  height: 47px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.delivery-dialog__actions :deep(.v-btn--variant-text) {
  height: 40px;
  color: var(--color-text-secondary);
}

.delivery-dialog__footer-row {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 3px;
}

.delivery-dialog__footer-row img {
  width: 108px;
  height: 38px;
  object-fit: contain;
}
</style>
