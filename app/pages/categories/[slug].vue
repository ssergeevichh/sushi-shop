<script setup lang="ts">
const route = useRoute()
const { categories, products } = useCatalog()
const slug = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug

const category = categories.value.find((item) => {
  return item.id !== 'all' && item.id === slug
})

if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Категорію не знайдено',
  })
}

const categoryProducts = products.value.filter((product) => {
  return product.categoryId === category.id
})

useSeoMeta({
  title: `${category.name} — ROLLIN’`,
  description: category.description,
  ogTitle: `${category.name} — ROLLIN’`,
  ogDescription: category.description,
  ogImage: category.image,
})
</script>

<template>
  <ProductListing
    :title="category.name"
    :description="category.description"
    :products="categoryProducts"
  />
</template>
