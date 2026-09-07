<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    productId: string
    productName: string
    quantity: number
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const {
  increase,
  decrease,
} = useCart()
</script>

<template>
  <div
    class="cart-quantity-controls"
    :class="{
      'cart-quantity-controls--compact': props.compact,
    }"
    role="group"
    :aria-label="`Кількість ${props.productName}`"
  >
    <VBtn
      class="cart-quantity-controls__button"
      type="button"
      icon
      density="compact"
      variant="text"
      :aria-label="props.quantity === 1
        ? `Видалити ${props.productName} з кошика`
        : `Зменшити кількість ${props.productName}`"
      @click="decrease(props.productId)"
    >
      <svg
        v-if="props.quantity === 1"
        class="cart-quantity-controls__trash"
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
      </svg>

      <svg v-else aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 12h14" />
      </svg>
    </VBtn>

    <output aria-live="polite">{{ props.quantity }}</output>

    <VBtn
      class="cart-quantity-controls__button cart-quantity-controls__button--increase"
      type="button"
      icon
      density="compact"
      color="primary"
      variant="flat"
      :aria-label="`Збільшити кількість ${props.productName}`"
      @click="increase(props.productId)"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </VBtn>
  </div>
</template>

<style scoped>
.cart-quantity-controls {
  --control-size: 40px;
  --output-size: 36px;

  display: grid;
  grid-template-columns: var(--control-size) var(--output-size) var(--control-size);
  align-items: center;
  width: max-content;
  padding: 4px;

  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 15px;
}

.cart-quantity-controls--compact {
  --control-size: 36px;
  --output-size: 34px;

  border-radius: 14px;
}

.cart-quantity-controls :deep(.cart-quantity-controls__button.v-btn) {
  --v-btn-height: var(--control-size);

  width: var(--control-size);
  height: var(--control-size);
  min-width: var(--control-size);
  padding: 0;
  color: var(--color-text-secondary);
  border-radius: 11px;
}

.cart-quantity-controls :deep(.cart-quantity-controls__button--increase.v-btn) {
  color: white;
  box-shadow: 0 6px 14px rgb(255 116 87 / 24%);
}

.cart-quantity-controls svg {
  width: 18px;
  height: 18px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.cart-quantity-controls__trash {
  color: var(--color-primary);
}

.cart-quantity-controls output {
  color: var(--color-text);
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  text-align: center;
}
</style>
