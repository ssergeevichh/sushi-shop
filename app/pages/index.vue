<script setup lang="ts">
useSeoMeta({
  title: 'ROLLIN’ Меню',
  description: 'Замовляйте свіжі роли та суші від ROLLIN’',
})

const categories = [
  {
    id: 'all',
    name: 'Усі',
    image: '/images/categories/all.webp',
  },
  {
    id: 'sets',
    name: 'Сети',
    image: '/images/categories/sets.webp',
  },
  {
    id: 'philadelphia',
    name: 'Філадельфія',
    image: '/images/categories/philadelphia.webp',
  },
  {
    id: 'california',
    name: 'Каліфорнія',
    image: '/images/categories/california.webp',
  },
  {
    id: 'baked',
    name: 'Запечені',
    image: '/images/categories/baked.webp',
  },
  {
    id: 'tempura',
    name: 'Темпура',
    image: '/images/categories/tempura.webp',
  },
  {
    id: 'maki',
    name: 'Макі',
    image: '/images/categories/maki.webp',
  },
  {
    id: 'vegetarian',
    name: 'Веган',
    image: '/images/categories/vegetarian.webp',
  },
]
</script>

<template>
  <main class="catalog-page">
    <HeroBanner />
    <PromoBanner />
    <CategoryCarousel :categories="categories" />
  </main>
</template>

<style scoped>
.catalog-page {
  display: flex;
  flex-direction: column;
  gap: 28px;

  min-height: 100dvh;
  padding: 40px var(--page-padding) var(--page-padding);
}
</style>
