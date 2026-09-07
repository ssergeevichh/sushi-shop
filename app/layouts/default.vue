<script setup lang="ts">
const route = useRoute()
const { totalItems } = useCart()

const hasStickyPurchase = computed(() => route.path.startsWith('/products/'))
const hasStickyCartCheckout = computed(() => route.path === '/cart' && totalItems.value > 0)
const isMiniCartOpen = ref(false)
</script>

<template>
  <div class="shop-layout">
    <AppHeader
      :cart-count="totalItems"
      :cart-open="isMiniCartOpen"
      @open-cart="isMiniCartOpen = true"
    />

    <MiniCart v-model="isMiniCartOpen" />

    <slot />
    <AppFooter
      :class="{
        'app-footer--with-sticky-purchase': hasStickyPurchase,
        'app-footer--with-sticky-cart-checkout': hasStickyCartCheckout,
      }"
    />
  </div>
</template>

<style scoped>
.shop-layout {
  width: 100%;
  min-height: 100dvh;
  margin: 0 auto;
  background: var(--color-surface);
}

@media (min-width: 768px) {
  .shop-layout {
    max-width: 430px;
    box-shadow: var(--shadow-page);
  }
}
</style>
