<script setup lang="ts">
const route = useRoute()
const { totalItems } = useCart()

const hasStickyPurchase = computed(() => route.path.startsWith('/products/'))
const isMiniCartOpen = ref(false)
const isNavigationOpen = ref(false)
const isDeliveryDialogOpen = ref(false)

function openCart() {
  isNavigationOpen.value = false
  isMiniCartOpen.value = !isMiniCartOpen.value
}

function openNavigation() {
  isMiniCartOpen.value = false
  isNavigationOpen.value = !isNavigationOpen.value
}
</script>

<template>
  <div class="shop-layout">
    <AppHeader
      :cart-count="totalItems"
      :cart-open="isMiniCartOpen"
      :menu-open="isNavigationOpen"
      @open-cart="openCart"
      @open-menu="openNavigation"
    />

    <AppNavigation
      v-model="isNavigationOpen"
      @open-delivery="isDeliveryDialogOpen = true"
    />
    <MiniCart v-model="isMiniCartOpen" />
    <DeliveryDialog v-model="isDeliveryDialogOpen" />

    <AppBreadcrumbs />

    <slot />
    <AppFooter
      :class="{
        'app-footer--with-sticky-purchase': hasStickyPurchase,
      }"
      @open-delivery="isDeliveryDialogOpen = true"
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
