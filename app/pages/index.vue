<script setup lang="ts">
import { categories } from '~/data/categories'
import { products } from '~/data/products'

useSeoMeta({
  title: 'СУШІ ROLLIN’',
  description: 'Замовляйте свіжі роли та суші від ROLLIN’',
})

const bestsellers = products.filter(product => product.labels.includes('bestseller'))

const {
  getQuantity,
  increase,
  decrease,
  remove,
} = useCart()
</script>

<template>
  <main class="catalog-page">
    <HeroBanner />
    <CategoryCarousel :categories="categories" />
    <PromoBanner />

    <section class="bestsellers" aria-labelledby="bestsellers-title">
      <h2 id="bestsellers-title">Хіти продажу</h2>

      <div class="bestsellers__list">
        <ProductCard
          v-for="product in bestsellers"
          :key="product.id"
          :product="product"
          :quantity="getQuantity(product.id)"
          @add="increase"
          @increase="increase"
          @decrease="decrease"
          @remove="remove"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.catalog-page {
  display: flex;
  flex-direction: column;
  gap: 28px;

  min-height: 100dvh;
  padding: 22px var(--page-padding) var(--page-padding);
}

.bestsellers {
  display: grid;
  gap: 12px;
}

.bestsellers__list {
  display: grid;
  gap: 16px;
}
</style>
