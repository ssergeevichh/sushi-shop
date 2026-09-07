<script setup lang="ts">
import type { Product, ProductViewMode } from '~/types/product'

const props = withDefaults(
  defineProps<{
    product: Product
    quantity?: number
    layout?: ProductViewMode
  }>(),
  {
    quantity: 0,
    layout: 'grid',
  },
)

const emit = defineEmits<{
  add: [productId: string]
  increase: [productId: string]
  decrease: [productId: string]
  remove: [productId: string]
}>()

const formattedPrice = computed(() => {
  return `${props.product.price.toLocaleString('uk-UA')} ₴`
})

const isBestseller = computed(() => props.product.labels.includes('bestseller'))

function handleAdd() {
  if (!props.product.available) {
    return
  }

  emit('add', props.product.id)
}

function handleIncrease() {
  if (!props.product.available) {
    return
  }

  emit('increase', props.product.id)
}

function handleDecrease() {
  if (props.quantity === 1) {
    emit('remove', props.product.id)
    return
  }

  emit('decrease', props.product.id)
}
</script>

<template>
  <VCard
    tag="article"
    class="product-card"
    :class="{
      'product-card--list': props.layout === 'list',
    }"
    variant="flat"
  >
    <NuxtLink
      class="product-card__media"
      :to="`/products/${props.product.slug}`"
      :aria-label="`Відкрити ${props.product.name}`"
    >
      <VImg
        :src="props.product.image"
        :alt="props.product.name"
        :aspect-ratio="props.layout === 'grid' ? 4 / 3 : undefined"
        :height="props.layout === 'list' ? '100%' : undefined"
        loading="lazy"
        cover
      />

      <VChip
        v-if="isBestseller"
        class="product-card__label"
        color="primary"
        size="small"
        label
      >
        Хіт продажу
      </VChip>
    </NuxtLink>

    <div class="product-card__content">
      <div class="product-card__heading">
        <h3>
          <NuxtLink
            class="product-card__title-link"
            :to="`/products/${props.product.slug}`"
          >
            {{ props.product.name }}
          </NuxtLink>
        </h3>

        <span class="product-card__details">
          {{ props.product.weight }} г
        </span>
      </div>

      <p class="product-card__ingredients">
        {{ props.product.ingredients.join(', ') }}
      </p>

      <div class="product-card__footer">
        <strong class="product-card__price">
          {{ formattedPrice }}
        </strong>

        <VBtn
          v-if="props.quantity === 0"
          class="product-card__add-button"
          type="button"
          icon
          color="primary"
          variant="flat"
          :disabled="!props.product.available"
          :aria-label="`Додати ${props.product.name} у кошик`"
          @click="handleAdd"
        >
          <svg
            class="product-card__plus"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </VBtn>

        <div
          v-else
          class="product-card__quantity-controls"
          role="group"
          :aria-label="`Кількість ${props.product.name}`"
        >
          <VBtn
            class="product-card__quantity-button"
            :class="{
              'product-card__quantity-button--remove': props.quantity === 1,
            }"
            type="button"
            icon
            variant="text"
            :aria-label="props.quantity === 1
              ? `Видалити ${props.product.name} з кошика`
              : `Зменшити кількість ${props.product.name}`"
            @click="handleDecrease"
          >
            <svg
              v-if="props.quantity === 1"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
            </svg>

            <svg
              v-else
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14" />
            </svg>
          </VBtn>

          <output class="product-card__quantity" aria-live="polite">
            {{ props.quantity }}
          </output>

          <VBtn
            class="product-card__quantity-button product-card__quantity-button--increase"
            type="button"
            icon
            color="primary"
            variant="flat"
            :disabled="!props.product.available"
            :aria-label="`Збільшити кількість ${props.product.name}`"
            @click="handleIncrease"
          >
            <svg
              class="product-card__plus"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </VBtn>
        </div>
      </div>
    </div>
  </VCard>
</template>

<style scoped>
.product-card {
  width: 100%;
  padding: 12px;
  overflow: hidden;

  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-card);
}

.product-card__media {
  display: block;
  position: relative;
  overflow: hidden;

  color: inherit;
  text-decoration: none;

  border-radius: 20px;
}

.product-card__media:focus-visible,
.product-card__title-link:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 3px;
}

.product-card__label {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;

  height: 28px;
  padding-inline: 11px;

  color: var(--color-primary);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  background: rgb(255 255 255 / 94%);
  border-radius: 999px;
  box-shadow: 0 4px 14px rgb(23 25 28 / 14%);
  backdrop-filter: blur(6px);
}

.product-card__content {
  padding: 16px 4px 4px;
}

.product-card__heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}

.product-card__heading h3 {
  font-size: 18px;
  letter-spacing: -0.015em;
}

.product-card__title-link {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.product-card__title-link:hover {
  color: var(--color-primary);
}

.product-card__details {
  padding-top: 3px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
}

.product-card__ingredients {
  display: -webkit-box;
  min-height: 38px;
  margin-top: 8px;
  overflow: hidden;

  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.45;
  text-overflow: ellipsis;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
}

.product-card__price {
  color: var(--color-text);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1;
}

.product-card__add-button {
  width: 48px;
  height: 48px;
  min-width: 48px;

  border-radius: 16px;
  box-shadow: 0 8px 20px rgb(255 116 87 / 24%);

  transition:
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.product-card__add-button:hover:not(:disabled) {
  box-shadow: 0 10px 24px rgb(255 116 87 / 32%);
  transform: translateY(-1px);
}

.product-card__add-button:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 3px;
}

.product-card__plus {
  width: 24px;
  height: 24px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 2;
}

.product-card__quantity-controls {
  display: grid;
  grid-template-columns: 40px 34px 40px;
  align-items: center;
  padding: 4px;

  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.product-card__quantity-button {
  width: 40px;
  height: 40px;
  min-width: 40px;

  color: var(--color-text-secondary);
  border-radius: 12px;
}

.product-card__quantity-button:hover:not(:disabled) {
  color: var(--color-text);
  background: var(--color-surface);
}

.product-card__quantity-button--remove {
  color: var(--color-primary);
}

.product-card__quantity-button--increase {
  color: white;
  box-shadow: 0 6px 16px rgb(255 116 87 / 22%);
}

.product-card__quantity-button svg {
  width: 20px;
  height: 20px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.product-card__quantity {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  text-align: center;
}

.product-card--list {
  display: grid;
  grid-template-columns: 124px minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
  padding: 10px;
}

.product-card--list .product-card__media {
  min-height: 160px;
  border-radius: 16px;
}

.product-card--list .product-card__label {
  top: 8px;
  left: 8px;
  height: 24px;
  padding-inline: 8px;
  font-size: 8px;
}

.product-card--list .product-card__content {
  display: flex;
  min-width: 0;
  padding: 4px 2px 2px;
  flex-direction: column;
}

.product-card--list .product-card__heading {
  grid-template-columns: 1fr;
  gap: 4px;
}

.product-card--list .product-card__heading h3 {
  font-size: 16px;
}

.product-card--list .product-card__details {
  padding-top: 0;
  font-size: 11px;
}

.product-card--list .product-card__ingredients {
  min-height: 34px;
  margin-top: 7px;
  font-size: 12px;
  line-height: 1.4;
}

.product-card--list .product-card__footer {
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
}

.product-card--list .product-card__price {
  font-size: 18px;
}

.product-card--list .product-card__add-button {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 13px;
}

.product-card--list .product-card__plus {
  width: 21px;
  height: 21px;
}

.product-card--list .product-card__quantity-controls {
  grid-template-columns: 34px 26px 34px;
  padding: 3px;
  border-radius: 13px;
}

.product-card--list .product-card__quantity-button {
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 10px;
}

.product-card--list .product-card__quantity-button svg {
  width: 17px;
  height: 17px;
}

.product-card--list .product-card__quantity {
  font-size: 13px;
}

@media (max-width: 359px) {
  .product-card {
    padding: 10px;
  }

  .product-card__content {
    padding: 14px 3px 3px;
  }

  .product-card__heading h3 {
    font-size: 16px;
  }

  .product-card__details {
    font-size: 11px;
  }

  .product-card__add-button {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 14px;
  }

  .product-card__quantity-controls {
    grid-template-columns: 38px 30px 38px;
  }

  .product-card__quantity-button {
    width: 38px;
    height: 38px;
    min-width: 38px;
  }

  .product-card--list {
    grid-template-columns: 104px minmax(0, 1fr);
    gap: 10px;
    padding: 8px;
  }

  .product-card--list .product-card__content {
    padding: 3px 1px 1px;
  }

  .product-card--list .product-card__footer {
    flex-wrap: wrap;
  }

  .product-card--list .product-card__add-button {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }

  .product-card--list .product-card__quantity-controls {
    grid-template-columns: 32px 24px 32px;
  }

  .product-card--list .product-card__quantity-button {
    width: 32px;
    height: 32px;
    min-width: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card__add-button,
  .product-card__quantity-button {
    transition: none;
  }
}
</style>
