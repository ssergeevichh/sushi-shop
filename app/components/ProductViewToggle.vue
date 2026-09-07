<script setup lang="ts">
import type { ProductViewMode } from '~/types/product'

const viewMode = defineModel<ProductViewMode>({ required: true })
</script>

<template>
  <VBtnToggle
    v-model="viewMode"
    class="product-view-toggle"
    color="primary"
    density="compact"
    variant="flat"
    mandatory
    aria-label="Режим відображення товарів"
  >
    <VBtn
      value="grid"
      icon
      aria-label="Картки з фотографією зверху"
      title="Великі картки"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="5" y="3.5" width="14" height="9" rx="2" />
        <path d="M6 15.5h12M6 19h8" />
      </svg>
    </VBtn>

    <VBtn
      value="list"
      icon
      aria-label="Компактні картки з фотографією зліва"
      title="Компактні картки"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="5" width="5" height="5" rx="1" />
        <path d="M12 7.5h8" />
        <rect x="4" y="14" width="5" height="5" rx="1" />
        <path d="M12 16.5h8" />
      </svg>
    </VBtn>
  </VBtnToggle>
</template>

<style scoped>
.product-view-toggle {
  flex: 0 0 auto;
  gap: 4px;
  padding: 4px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 14px;
}

.product-view-toggle :deep(.v-btn) {
  width: 36px;
  height: 36px;
  min-width: 36px;
  color: var(--color-text-muted);
  border-radius: 10px;
}

.product-view-toggle :deep(.v-btn--active) {
  color: white;
  background: var(--color-text);
}

.product-view-toggle svg {
  width: 19px;
  height: 19px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}
</style>
