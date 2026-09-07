<script setup lang="ts">
import type { Product } from '~/types/product'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    products: Product[]
    eyebrow?: string
  }>(),
  {
    description: '',
    eyebrow: 'Меню ROLLIN’',
  },
)

const {
  getQuantity,
  increase,
  decrease,
  remove,
} = useCart()

const viewMode = useProductViewMode()

function getPositionsLabel(count: number) {
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'позицій'
  }

  const lastDigit = count % 10

  if (lastDigit === 1) {
    return 'позиція'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'позиції'
  }

  return 'позицій'
}
</script>

<template>
  <main class="product-listing">
    <NuxtLink class="product-listing__back" to="/">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m15 18-6-6 6-6" />
      </svg>

      На головну
    </NuxtLink>

    <header class="product-listing__header">
      <span>{{ props.eyebrow }}</span>

      <div class="product-listing__title-row">
        <h1>{{ props.title }}</h1>
        <ProductViewToggle v-if="props.products.length" v-model="viewMode" />
      </div>

      <p v-if="props.description">
        {{ props.description }}
      </p>

      <small aria-live="polite">
        Знайдено {{ props.products.length }}
        {{ getPositionsLabel(props.products.length) }}
      </small>
    </header>

    <section
      v-if="props.products.length"
      class="product-listing__grid"
      :aria-label="`Товари категорії ${props.title}`"
    >
      <ProductCard
        v-for="product in props.products"
        :key="product.id"
        :product="product"
        :quantity="getQuantity(product.id)"
        :layout="viewMode"
        @add="increase"
        @increase="increase"
        @decrease="decrease"
        @remove="remove"
      />
    </section>

    <section v-else class="product-listing__empty">
      <div class="product-listing__empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4M8.5 8.5l5 5m0-5-5 5" />
        </svg>
      </div>

      <h2>У цій категорії поки порожньо</h2>
      <p>Переглянь усі доступні позиції нашого меню.</p>

      <VBtn
        to="/menu"
        color="primary"
        variant="flat"
      >
        Відкрити все меню
      </VBtn>
    </section>
  </main>
</template>

<style scoped>
.product-listing {
  min-height: 100dvh;
  padding: 28px var(--page-padding) 40px;
}

.product-listing__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 26px;

  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 700;
}

.product-listing__back:hover {
  color: var(--color-primary);
}

.product-listing__back:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 3px;
}

.product-listing__back svg {
  width: 20px;
  height: 20px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.product-listing__header {
  display: grid;
  gap: 9px;
  margin-bottom: 24px;
}

.product-listing__header > span {
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.product-listing__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.product-listing__header > p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.55;
}

.product-listing__header > small {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 600;
}

.product-listing__grid {
  display: grid;
  gap: 16px;
}

.product-listing__empty {
  display: grid;
  justify-items: center;
  padding: 40px 20px;
  text-align: center;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
}

.product-listing__empty-icon {
  display: grid;
  width: 60px;
  height: 60px;
  margin-bottom: 18px;
  place-items: center;
  color: var(--color-primary);
  background: rgb(255 116 87 / 10%);
  border-radius: 18px;
}

.product-listing__empty-icon svg {
  width: 28px;
  height: 28px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.product-listing__empty > p {
  margin: 8px 0 20px;
  color: var(--color-text-muted);
  font-size: 13px;
}

.product-listing__empty :deep(.v-btn) {
  height: 44px;
  border-radius: 13px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}
</style>
