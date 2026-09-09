<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false })
const route = useRoute()
const { categories } = useCatalog()

const emit = defineEmits<{
  openDelivery: []
}>()

const menuCategories = computed(() => {
  return categories.value.filter(category => category.id !== 'all')
})

function closeNavigation() {
  isOpen.value = false
}

function openDelivery() {
  closeNavigation()
  emit('openDelivery')
}

watch(
  () => route.fullPath,
  () => {
    isOpen.value = false
  },
)
</script>

<template>
  <VNavigationDrawer
    id="app-navigation"
    v-model="isOpen"
    class="app-navigation"
    location="left"
    :width="390"
    temporary
  >
    <header class="app-navigation__header">
      <NuxtLink to="/" aria-label="ROLLIN’ — на головну" @click="closeNavigation">
        <img src="/images/brand/brand-logo.png" alt="ROLLIN’">
      </NuxtLink>

      <div>
        <h2>Меню</h2>
        <p>Обери потрібний розділ</p>
      </div>

      <VBtn
        type="button"
        icon
        variant="text"
        aria-label="Закрити меню"
        @click="closeNavigation"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </VBtn>
    </header>

    <div class="app-navigation__body">
      <nav class="app-navigation__main" aria-label="Основна навігація">
        <NuxtLink
          to="/"
          exact-active-class="app-navigation__link--active"
          @click="closeNavigation"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z" />
          </svg>
          <span>Головна</span>
        </NuxtLink>

        <NuxtLink
          to="/menu"
          active-class="app-navigation__link--active"
          @click="closeNavigation"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Усе меню</span>
        </NuxtLink>

        <NuxtLink
          to="/cart"
          active-class="app-navigation__link--active"
          @click="closeNavigation"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="17" cy="20" r="1" />
          </svg>
          <span>Кошик</span>
        </NuxtLink>
      </nav>

      <section class="app-navigation__categories" aria-labelledby="navigation-categories-title">
        <h3 id="navigation-categories-title">Категорії</h3>

        <ul>
          <li v-for="category in menuCategories" :key="category.id">
            <NuxtLink
              :to="`/categories/${category.id}`"
              active-class="app-navigation__category--active"
              @click="closeNavigation"
            >
              <VImg
                :src="category.image"
                :alt="category.name"
                :aspect-ratio="1"
                cover
              />

              <span>{{ category.name }}</span>

              <svg aria-hidden="true" viewBox="0 0 20 20">
                <path d="m8 5 5 5-5 5" />
              </svg>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <nav class="app-navigation__service" aria-label="Сервісна інформація">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-controls="delivery-dialog"
          @click="openDelivery"
        >
          <span>Доставка та контакти</span>
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="m8 5 5 5-5 5" />
          </svg>
        </button>
      </nav>
    </div>

    <footer class="app-navigation__footer">
      <a href="tel:+380990000000">+380 (99) 000 00 00</a>
      <span>Щодня 10:00 — 22:00</span>
    </footer>
  </VNavigationDrawer>
</template>

<style scoped>
.app-navigation {
  max-width: calc(100vw - 12px);
  color: var(--color-text);
  background: var(--color-surface);
}

.app-navigation :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}

.app-navigation__header {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 42px;
  flex: 0 0 auto;
  align-items: center;
  gap: 11px;
  min-height: 78px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.app-navigation__header > a {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border-radius: 14px;
}

.app-navigation__header img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.app-navigation__header h2 {
  font-size: 19px;
}

.app-navigation__header p {
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 600;
}

.app-navigation__header :deep(.v-btn) {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 14px;
}

.app-navigation__header svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.app-navigation__body {
  flex: 1 1 auto;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 16px 18px 22px;
}

.app-navigation__main {
  display: grid;
  gap: 5px;
}

.app-navigation__main a {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 0 14px;
  color: var(--color-text-secondary);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);
}

.app-navigation__main a:hover,
.app-navigation__main .app-navigation__link--active {
  color: var(--color-primary);
  background: rgb(255 116 87 / 9%);
}

.app-navigation__main svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.app-navigation__categories {
  margin-top: 25px;
}

.app-navigation__categories h3 {
  margin-bottom: 11px;
  color: var(--color-text-muted);
  font-size: 11px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.app-navigation__categories ul {
  display: grid;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-navigation__categories a {
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr) 18px;
  min-height: 58px;
  align-items: center;
  gap: 12px;
  padding: 4px 10px 4px 4px;
  color: var(--color-text-secondary);
  border: 1px solid transparent;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 800;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.app-navigation__categories a:hover,
.app-navigation__categories .app-navigation__category--active {
  color: var(--color-primary);
  background: var(--color-surface-soft);
  border-color: var(--color-border);
}

.app-navigation__categories :deep(.v-img) {
  width: 50px;
  height: 50px;
  border-radius: 12px;
}

.app-navigation__categories svg,
.app-navigation__service svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.app-navigation__service {
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
}

.app-navigation__service button {
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: var(--color-text-secondary);
  background: transparent;
  border: 0;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
}

.app-navigation__service button:hover {
  color: var(--color-primary);
  background: var(--color-surface-soft);
}

.app-navigation__footer {
  display: grid;
  flex: 0 0 auto;
  gap: 2px;
  padding: 14px 18px max(14px, env(safe-area-inset-bottom));
  background: var(--color-surface-soft);
  border-top: 1px solid var(--color-border);
}

.app-navigation__footer a {
  width: max-content;
  color: var(--color-text);
  font-size: 13px;
  font-weight: 800;
}

.app-navigation__footer span {
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 600;
}

.app-navigation a:focus-visible,
.app-navigation button:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 2px;
}

@media (max-width: 359px) {
  .app-navigation__header,
  .app-navigation__body,
  .app-navigation__footer {
    padding-right: 14px;
    padding-left: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-navigation__main a,
  .app-navigation__categories a {
    transition: none;
  }
}
</style>
