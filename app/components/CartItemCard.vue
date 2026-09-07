<script setup lang="ts">
import type { CartItem } from '~/composables/useCart'
import { formatPrice, formatWeight } from '~/utils/formatters'

const props = defineProps<{
  item: CartItem
}>()

const { remove } = useCart()
</script>

<template>
  <li class="cart-item-card">
    <NuxtLink
      class="cart-item-card__image"
      :to="`/products/${props.item.product.slug}`"
      :aria-label="`Відкрити ${props.item.product.name}`"
    >
      <VImg
        :src="props.item.product.image"
        :alt="props.item.product.name"
        :aspect-ratio="1"
        loading="lazy"
        cover
      />
    </NuxtLink>

    <div class="cart-item-card__content">
      <div class="cart-item-card__heading">
        <h3>
          <NuxtLink :to="`/products/${props.item.product.slug}`">
            {{ props.item.product.name }}
          </NuxtLink>
        </h3>

        <VBtn
          class="cart-item-card__remove-button"
          type="button"
          icon
          density="compact"
          variant="text"
          :aria-label="`Видалити ${props.item.product.name} з кошика`"
          @click="remove(props.item.product.id)"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
          </svg>
        </VBtn>
      </div>

      <p class="cart-item-card__weight">
        {{ props.item.product.weight }} г
        <template v-if="props.item.quantity > 1">
          × {{ props.item.quantity }}
        </template>
      </p>

      <div class="cart-item-card__footer">
        <CartQuantityControls
          :product-id="props.item.product.id"
          :product-name="props.item.product.name"
          :quantity="props.item.quantity"
          compact
        />

        <div class="cart-item-card__total">
          <strong>{{ formatPrice(props.item.totalPrice) }}</strong>
          <small v-if="props.item.quantity > 1">
            {{ formatWeight(props.item.totalWeight) }} разом
          </small>
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped>
.cart-item-card {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 13px;
  padding: 18px 0;
  border-bottom: 1px solid var(--color-border);
}

.cart-item-card:last-child {
  padding-bottom: 2px;
  border-bottom: 0;
}

.cart-item-card__image {
  display: block;
  align-self: start;
  overflow: hidden;
  border-radius: 16px;
}

.cart-item-card__image:focus-visible,
.cart-item-card__heading a:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 3px;
}

.cart-item-card__content {
  min-width: 0;
}

.cart-item-card__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.cart-item-card__heading h3 {
  min-width: 0;
  font-size: 15px;
}

.cart-item-card__heading a {
  display: block;
}

.cart-item-card__heading a:hover {
  color: var(--color-primary);
}

.cart-item-card__remove-button {
  flex: 0 0 auto;
}

.cart-item-card__heading :deep(.cart-item-card__remove-button.v-btn) {
  --v-btn-height: 32px;

  width: 32px;
  height: 32px;
  min-width: 32px;
  margin-top: -7px;
  margin-right: -7px;
  padding: 0;
  color: var(--color-text-muted);
  border-radius: 10px;
}

.cart-item-card__remove-button svg {
  width: 17px;
  height: 17px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.cart-item-card__weight {
  margin-top: 6px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 600;
}

.cart-item-card__footer {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.cart-item-card__total {
  display: grid;
  gap: 5px;
  justify-self: end;
  justify-items: end;
  text-align: right;
}

.cart-item-card__total small {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 600;
  white-space: nowrap;
}

.cart-item-card__total strong {
  font-size: 16px;
  line-height: 1;
  white-space: nowrap;
}

@media (max-width: 359px) {
  .cart-item-card {
    grid-template-columns: 78px minmax(0, 1fr);
    gap: 10px;
  }

  .cart-item-card__footer {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .cart-item-card__total {
    justify-self: start;
    justify-items: start;
    text-align: left;
  }
}
</style>
