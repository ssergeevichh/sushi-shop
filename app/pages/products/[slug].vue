<script setup lang="ts">
import { products } from '~/data/products'

const route = useRoute()
const slug = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug

const product = products.find(item => item.slug === slug)

if (!product) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Товар не знайдено',
  })
}

const {
  getQuantity,
  increase,
  decrease,
} = useCart()

const quantity = computed(() => getQuantity(product.id))
const formattedPrice = computed(() => {
  return `${product.price.toLocaleString('uk-UA')} ₴`
})

const productLabels = {
  bestseller: 'Хіт продажу',
  new: 'Новинка',
  spicy: 'Гостре',
} as const

useSeoMeta({
  title: `${product.name} — ROLLIN’`,
  description: product.description,
  ogTitle: `${product.name} — ROLLIN’`,
  ogDescription: product.description,
  ogImage: product.image,
})
</script>

<template>
  <main class="product-page">
    <article class="product-details">
      <div class="product-details__media">
        <VImg
          :src="product.image"
          :alt="product.name"
          :aspect-ratio="1"
          cover
        />

        <div
          v-if="product.labels.length"
          class="product-details__labels"
        >
          <VChip
            v-for="label in product.labels"
            :key="label"
            color="primary"
            size="small"
            label
          >
            {{ productLabels[label] }}
          </VChip>
        </div>
      </div>

      <div class="product-details__content">
        <div class="product-details__heading">
          <h1>{{ product.name }}</h1>
          <strong>{{ formattedPrice }}</strong>
        </div>

        <p class="product-details__meta">
          {{ product.weight }} г
        </p>

        <section class="product-details__section">
          <h2>Опис</h2>
          <p>{{ product.description }}</p>
        </section>

        <section class="product-details__section">
          <h2>Склад</h2>

          <ul class="product-details__ingredients">
            <li
              v-for="ingredient in product.ingredients"
              :key="ingredient"
            >
              {{ ingredient }}
            </li>
          </ul>
        </section>

        <div class="product-details__purchase">
          <VBtn
            v-if="quantity === 0"
            class="product-details__add-button"
            type="button"
            color="primary"
            variant="flat"
            block
            :disabled="!product.available"
            @click="increase(product.id)"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>

            {{ product.available ? 'Додати до кошика' : 'Немає в наявності' }}
          </VBtn>

          <div
            v-else
            class="product-details__quantity-controls"
            role="group"
            :aria-label="`Кількість ${product.name}`"
          >
            <VBtn
              type="button"
              icon
              variant="text"
              :aria-label="quantity === 1
                ? `Видалити ${product.name} з кошика`
                : `Зменшити кількість ${product.name}`"
              @click="decrease(product.id)"
            >
              <svg
                v-if="quantity === 1"
                class="product-details__trash-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
              </svg>

              <svg v-else aria-hidden="true" viewBox="0 0 24 24">
                <path d="M5 12h14" />
              </svg>
            </VBtn>

            <output aria-live="polite">{{ quantity }}</output>

            <VBtn
              type="button"
              icon
              color="primary"
              variant="flat"
              :aria-label="`Збільшити кількість ${product.name}`"
              @click="increase(product.id)"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </VBtn>
          </div>
        </div>
      </div>
    </article>
  </main>
</template>

<style scoped>
.product-page {
  min-height: 100dvh;
  padding: 16px var(--page-padding) 116px;
}

.product-details {
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-card);
}

.product-details__media {
  position: relative;
  overflow: hidden;
  margin: 12px;
  border-radius: 22px;
}

.product-details__labels {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-details__labels :deep(.v-chip) {
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 4px 14px rgb(23 25 28 / 14%);
  backdrop-filter: blur(6px);
}

.product-details__content {
  padding: 8px 20px 20px;
}

.product-details__heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
}

.product-details__heading strong {
  padding-top: 4px;
  color: var(--color-primary);
  font-size: 22px;
  line-height: 1;
  white-space: nowrap;
}

.product-details__meta {
  margin-top: 6px;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 700;
}

.product-details__section {
  display: grid;
  gap: 8px;
  margin-top: 24px;
}

.product-details__section p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.product-details__ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.product-details__ingredients li {
  padding: 7px 10px;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 600;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}

.product-details__purchase {
  position: fixed;
  z-index: 30;
  right: 12px;
  bottom: max(12px, env(safe-area-inset-bottom));
  left: 12px;

  width: min(calc(100% - 24px), 406px);
  margin: 0 auto;
  padding: 6px;

  background: rgb(255 255 255 / 88%);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgb(23 25 28 / 12%);
  backdrop-filter: blur(12px);
}

@media (min-width: 768px) {
  .product-details__purchase {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
}

.product-details__add-button {
  height: 50px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.product-details__add-button svg,
.product-details__quantity-controls svg {
  width: 21px;
  height: 21px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.product-details__add-button svg {
  margin-right: 8px;
}

.product-details__quantity-controls {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) 46px;
  align-items: center;
  min-height: 50px;
}

.product-details__quantity-controls :deep(.v-btn) {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 12px;
}

.product-details__quantity-controls output {
  color: var(--color-text);
  font-size: 17px;
  font-weight: 800;
  text-align: center;
}

.product-details__trash-icon {
  color: var(--color-primary);
}

@media (max-width: 359px) {
  .product-details__heading {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .product-details__heading strong {
    padding-top: 0;
  }
}
</style>
