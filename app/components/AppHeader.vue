<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    cartCount?: number
    cartOpen?: boolean
  }>(),
  {
    cartCount: 0,
    cartOpen: false,
  },
)

const emit = defineEmits<{
  openCart: []
}>()
</script>

<template>
  <header class="app-header">
    <div class="app-header__side app-header__side--start">
      <VBtn
        class="app-header__button"
        type="button"
        icon
        variant="flat"
        aria-label="Відкрити категорії"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </VBtn>
    </div>

    <NuxtLink
      class="app-header__logo"
      to="/"
      aria-label="ROLLIN’ — головна сторінка"
    >
      <img
        src="/images/brand/brand-logo.png"
        alt="ROLLIN’"
      >
    </NuxtLink>

    <div class="app-header__side app-header__side--end">
      <VBtn
        class="app-header__button"
        type="button"
        icon
        variant="flat"
        aria-label="Відкрити пошук"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />
          <path d="m16 16 4 4" />
        </svg>
      </VBtn>

      <VBadge
        class="app-header__cart"
        :model-value="props.cartCount > 0"
        :content="props.cartCount"
        :max="99"
        color="primary"
        bordered
        location="top end"
        :aria-label="`Товарів у кошику: ${props.cartCount}`"
      >
        <VBtn
          class="app-header__button"
          type="button"
          icon
          variant="flat"
          aria-label="Відкрити кошик"
          aria-controls="mini-cart"
          :aria-expanded="props.cartOpen"
          @click="emit('openCart')"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6" />
            <circle
              cx="10"
              cy="20"
              r="1"
            />
            <circle
              cx="17"
              cy="20"
              r="1"
            />
          </svg>
        </VBtn>
      </VBadge>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  isolation: isolate;

  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 64px;
  padding: 0 var(--page-padding);

  background: rgb(255 255 255 / 96%);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
}

.app-header__side {
  display: flex;
  flex: 1 1 0;
  align-items: center;
}

.app-header__side--start {
  justify-content: flex-start;
}

.app-header__side--end {
  justify-content: flex-end;
  gap: 8px;
}

.app-header__logo {
  position: absolute;
  top: -16px;
  left: 50%;

  display: grid;
  place-items: center;

  width: 96px;
  height: 96px;

  transform: translateX(-50%);
}

.app-header__logo::before {
  content: '';
  position: absolute;
  inset: 13px;
  z-index: -1;

  background: var(--color-surface);
  border: 1px solid rgb(255 116 87 / 10%);
  border-radius: 12px;
  box-shadow: 0 10px 28px rgb(23 25 28 / 14%);

  transform: rotate(45deg);
  transition:
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.app-header__logo img {
  position: relative;
  width: 62px;
  height: 62px;
  object-fit: contain;
}

.app-header__logo:hover::before {
  box-shadow: 0 12px 32px rgb(23 25 28 / 18%);
  transform: rotate(45deg) scale(1.03);
}

.app-header__logo:focus-visible {
  border-radius: 18px;
  outline: 3px solid rgb(255 116 87 / 30%);
  outline-offset: 2px;
}

.app-header__button {
  display: grid;
  place-items: center;

  width: 44px;
  height: 44px;
  min-width: 44px;
  padding: 0;

  color: var(--color-text-secondary);
  background: var(--color-surface-soft);
  border: 1px solid transparent;
  border-radius: 14px;

  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.app-header__button:hover {
  color: var(--color-text);
  border-color: var(--color-border);
}

.app-header__button:focus-visible {
  outline: 3px solid rgb(255 116 87 / 30%);
  outline-offset: 2px;
}

.app-header__button svg {
  width: 21px;
  height: 21px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.app-header__cart {
  line-height: 1;
}

.app-header__cart :deep(.v-badge__badge) {
  min-width: 20px;
  height: 20px;
  padding: 0 5px;

  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
}

@media (max-width: 359px) {
  .app-header {
    padding-inline: 14px;
  }

  .app-header__side--end {
    gap: 6px;
  }

  .app-header__button {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }

  .app-header__logo {
    width: 90px;
    height: 90px;
  }

  .app-header__logo::before {
    inset: 12px;
  }

  .app-header__logo img {
    width: 56px;
    height: 56px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-header__button,
  .app-header__logo::before {
    transition: none;
  }
}
</style>
