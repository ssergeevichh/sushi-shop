<template>
  <div class="shop-layout">
    <AppHeader :cart-count="3" />
    <slot />
    <AppFooter />
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
