<script setup lang="ts">
interface Category {
  id: string
  name: string
  image: string
}

const props = defineProps<{
  categories: Category[]
}>()

const route = useRoute()
const categoryList = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

let resizeObserver: ResizeObserver | undefined

function updateScrollControls() {
  const list = categoryList.value

  if (!list) {
    return
  }

  const scrollEnd = list.scrollWidth - list.clientWidth

  canScrollLeft.value = list.scrollLeft > 2
  canScrollRight.value = list.scrollLeft < scrollEnd - 2
}

function scrollCategories(direction: 'left' | 'right') {
  const list = categoryList.value

  if (!list) {
    return
  }

  const scrollDistance = Math.max(list.clientWidth - 48, 180)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  list.scrollBy({
    left: direction === 'left' ? -scrollDistance : scrollDistance,
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
}

onMounted(() => {
  updateScrollControls()

  if (categoryList.value) {
    resizeObserver = new ResizeObserver(updateScrollControls)
    resizeObserver.observe(categoryList.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

function getCategoryLink(categoryId: string) {
  return {
    path: '/',
    query: {
      category: categoryId,
    },
  }
}

function isActiveCategory(categoryId: string) {
  return route.query.category === categoryId
}
</script>

<template>
  <nav
    id="categories"
    class="category-carousel"
    aria-labelledby="categories-title"
  >
    <div class="category-carousel__header">
      <h2 id="categories-title">
        Категорії
      </h2>

      <div class="category-carousel__controls" aria-label="Керування категоріями">
        <VBtn
          class="category-carousel__control"
          type="button"
          icon
          variant="outlined"
          :disabled="!canScrollLeft"
          aria-label="Попередні категорії"
          @click="scrollCategories('left')"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </VBtn>

        <VBtn
          class="category-carousel__control"
          type="button"
          icon
          variant="outlined"
          :disabled="!canScrollRight"
          aria-label="Наступні категорії"
          @click="scrollCategories('right')"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </VBtn>
      </div>
    </div>

    <div
      ref="categoryList"
      class="category-carousel__list"
      @scroll.passive="updateScrollControls"
    >
      <NuxtLink
        v-for="category in props.categories"
        :key="category.id"
        :to="getCategoryLink(category.id)"
        class="category-card"
        :class="{
          'category-card--active': isActiveCategory(category.id),
        }"
        :aria-current="isActiveCategory(category.id) ? 'page' : undefined"
      >
        <span class="category-card__image-wrapper">
          <img
            class="category-card__image"
            :src="category.image"
            alt=""
            width="84"
            height="84"
          >
        </span>

        <span class="category-card__name">
          {{ category.name }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.category-carousel {
  width: 100%;
  scroll-margin-top: 80px;
}

.category-carousel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.category-carousel__header h2 {
  color: var(--color-text);
}

.category-carousel__controls {
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
}

.category-carousel__control {
  display: grid;
  width: 34px;
  height: 34px;
  min-width: 34px;
  padding: 0;
  place-items: center;

  color: var(--color-text-secondary);

  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;

  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast);
}

.category-carousel__control:hover:not(:disabled) {
  color: var(--color-primary);
  border-color: rgb(255 116 87 / 35%);
  transform: translateY(-1px);
}

.category-carousel__control:focus-visible {
  outline: 3px solid rgb(255 116 87 / 22%);
  outline-offset: 2px;
}

.category-carousel__control:disabled {
  cursor: default;
  opacity: 0.35;
}

.category-carousel__control svg {
  width: 18px;
  height: 18px;

  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.category-carousel__list {
  display: flex;
  gap: 6px;
  padding: 4px 0 12px;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
  scroll-snap-type: inline proximity;
}

.category-carousel__list::-webkit-scrollbar {
  display: none;
}

.category-card {
  flex: 0 0 84px;

  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  color: var(--color-text-secondary);

  scroll-snap-align: start;
}

.category-card__image-wrapper {
  width: 84px;
  height: 84px;
  padding: 3px;

  background: var(--color-surface);
  border: 2px solid transparent;
  border-radius: 18px;

  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.category-card__image {
  width: 100%;
  height: 100%;

  object-fit: cover;
  border-radius: 13px;
}

.category-card__name {
  max-width: 84px;

  overflow: hidden;

  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-card:hover .category-card__image-wrapper {
  transform: translateY(-2px);
}

.category-card:focus-visible {
  outline: none;
}

.category-card:focus-visible .category-card__image-wrapper {
  outline: 3px solid rgb(255 116 87 / 25%);
  outline-offset: 2px;
}

.category-card--active {
  color: var(--color-primary);
}

.category-card--active .category-card__image-wrapper {
  border-color: var(--color-primary);
  box-shadow: 0 6px 18px rgb(255 116 87 / 20%);
}

@media (prefers-reduced-motion: reduce) {
  .category-carousel__control,
  .category-card__image-wrapper {
    transition: none;
  }
}
</style>
