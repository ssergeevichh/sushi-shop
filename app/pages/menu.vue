<script setup lang="ts">
import { categories } from '~/data/categories'
import { products } from '~/data/products'
import { getPositionsLabel } from '~/utils/formatters'

const route = useRoute()
const menuPage = ref<HTMLElement | null>(null)
const quickNavigation = ref<HTMLElement | null>(null)
const menuNavigation = ref<HTMLElement | null>(null)

const menuSections = categories
  .filter(category => category.id !== 'all')
  .map(category => ({
    category,
    products: products.filter(product => product.categoryId === category.id),
  }))
  .filter(section => section.products.length > 0)

const routeCategoryId = route.hash.replace('#', '')
const initialCategoryId = menuSections.some(({ category }) => category.id === routeCategoryId)
  ? routeCategoryId
  : menuSections[0]?.category.id ?? ''

const activeCategoryId = ref(initialCategoryId)
const viewMode = useProductViewMode()
const totalMenuItems = menuSections.reduce((total, section) => {
  return total + section.products.length
}, 0)

let scrollFrame: number | undefined

function centerActiveNavigationItem(categoryId: string) {
  const navigation = menuNavigation.value
  const item = navigation?.querySelector<HTMLElement>(
    `[data-category-link="${categoryId}"]`,
  )

  if (!navigation || !item) {
    return
  }

  const itemCenter = item.offsetLeft + item.offsetWidth / 2
  const navigationCenter = navigation.clientWidth / 2
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  navigation.scrollTo({
    left: itemCenter - navigationCenter,
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
}

function updateActiveCategory() {
  if (scrollFrame !== undefined) {
    return
  }

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = undefined

    const sections = menuPage.value?.querySelectorAll<HTMLElement>('[data-menu-section]')

    if (!sections?.length) {
      return
    }

    const activationLine = quickNavigation.value
      ? quickNavigation.value.getBoundingClientRect().bottom + 16
      : 144
    let nextCategoryId = sections[0]?.dataset.categoryId ?? ''

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activationLine) {
        nextCategoryId = section.dataset.categoryId ?? nextCategoryId
      }
    })

    if (nextCategoryId && nextCategoryId !== activeCategoryId.value) {
      activeCategoryId.value = nextCategoryId
      centerActiveNavigationItem(nextCategoryId)
    }
  })
}

function selectCategory(categoryId: string) {
  activeCategoryId.value = categoryId
  centerActiveNavigationItem(categoryId)
}

const {
  getQuantity,
  increase,
  decrease,
  remove,
} = useCart()

onMounted(() => {
  updateActiveCategory()
  window.addEventListener('scroll', updateActiveCategory, { passive: true })
  window.addEventListener('resize', updateActiveCategory)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveCategory)
  window.removeEventListener('resize', updateActiveCategory)

  if (scrollFrame !== undefined) {
    window.cancelAnimationFrame(scrollFrame)
  }
})

useSeoMeta({
  title: 'Меню — ROLLIN’',
  description: 'Усі роли, сети та гарячі позиції в меню ROLLIN’.',
  ogTitle: 'Меню — ROLLIN’',
  ogDescription: 'Усі роли, сети та гарячі позиції в меню ROLLIN’.',
})
</script>

<template>
  <main ref="menuPage" class="menu-page">
    <header class="menu-page__header">
      <h1>Усе меню</h1>
      <p>Обирай улюблені роли та збирай своє замовлення.</p>
    </header>

    <nav
      ref="quickNavigation"
      class="menu-page__quick-navigation"
      aria-label="Швидка навігація меню"
    >
      <div ref="menuNavigation" class="menu-page__quick-navigation-list">
        <NuxtLink
          v-for="section in menuSections"
          :key="section.category.id"
          :to="{
            path: '/menu',
            hash: `#${section.category.id}`,
          }"
          class="menu-page__quick-navigation-link"
          :class="{
            'menu-page__quick-navigation-link--active': activeCategoryId === section.category.id,
          }"
          :data-category-link="section.category.id"
          :aria-current="activeCategoryId === section.category.id ? 'location' : undefined"
          @click="selectCategory(section.category.id)"
        >
          {{ section.category.name }}
        </NuxtLink>
      </div>
    </nav>

    <div class="menu-page__toolbar">
      <p aria-live="polite">
        Всього {{ totalMenuItems }} {{ getPositionsLabel(totalMenuItems) }}
      </p>

      <ProductViewToggle v-model="viewMode" />
    </div>

    <div class="menu-page__sections">
      <section
        v-for="section in menuSections"
        :id="section.category.id"
        :key="section.category.id"
        class="menu-section"
        :data-category-id="section.category.id"
        data-menu-section
        :aria-labelledby="`${section.category.id}-title`"
      >
        <header class="menu-section__header">
          <h2 :id="`${section.category.id}-title`">
            {{ section.category.name }}
          </h2>
          <p>{{ section.category.description }}</p>
        </header>

        <div class="menu-section__products">
          <ProductCard
            v-for="product in section.products"
            :key="product.id"
            :product="product"
            :quantity="getQuantity(product.id)"
            :layout="viewMode"
            @add="increase"
            @increase="increase"
            @decrease="decrease"
            @remove="remove"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.menu-page {
  min-height: 100dvh;
  padding-bottom: 40px;
}

.menu-page__header {
  display: grid;
  gap: 8px;
  padding: 24px var(--page-padding);
}

.menu-page__header p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.menu-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px var(--page-padding) 0;
}

.menu-page__toolbar p {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 700;
}

.menu-page__quick-navigation {
  position: sticky;
  top: 64px;
  z-index: 8;
  padding: 12px var(--page-padding);
  background: rgb(255 255 255 / 94%);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
}

.menu-page__quick-navigation-list {
  display: flex;
  gap: 8px;
  padding: 2px 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
}

.menu-page__quick-navigation-list::-webkit-scrollbar {
  display: none;
}

.menu-page__quick-navigation-link {
  flex: 0 0 auto;
  padding: 10px 16px;

  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.025em;

  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 999px;

  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast);
}

.menu-page__quick-navigation-link:hover {
  color: var(--color-text);
  transform: translateY(-1px);
}

.menu-page__quick-navigation-link:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 2px;
}

.menu-page__quick-navigation-link--active {
  color: white;
  background: var(--color-text);
  border-color: var(--color-text);
  box-shadow: 0 6px 16px rgb(23 25 28 / 14%);
}

.menu-page__quick-navigation-link--active:hover {
  color: white;
}

.menu-page__sections {
  display: grid;
  gap: 38px;
  padding: 22px var(--page-padding) 0;
}

.menu-section {
  display: grid;
  gap: 16px;
  scroll-margin-top: 142px;
}

.menu-section__header {
  display: block;
}

.menu-section__header p {
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.45;
}

.menu-section__products {
  display: grid;
  gap: 16px;
}

@media (max-width: 359px) {
  .menu-page__header,
  .menu-page__quick-navigation,
  .menu-page__toolbar,
  .menu-page__sections {
    padding-right: 14px;
    padding-left: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu-page__quick-navigation-link {
    transition: none;
  }
}
</style>
