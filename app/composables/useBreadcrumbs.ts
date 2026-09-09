import type { RouteLocationRaw } from 'vue-router'

export interface BreadcrumbItem {
  title: string
  to?: RouteLocationRaw
}

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export function useBreadcrumbs() {
  const route = useRoute()
  const { categories, products } = useCatalog()

  return computed<BreadcrumbItem[]>(() => {
    if (route.path === '/') {
      return []
    }

    const home: BreadcrumbItem = {
      title: 'Головна',
      to: '/',
    }

    if (route.path === '/menu') {
      return [home, { title: 'Меню' }]
    }

    if (route.path === '/cart') {
      return [home, { title: 'Кошик' }]
    }

    if (route.path === '/checkout') {
      return [
        home,
        { title: 'Кошик', to: '/cart' },
        { title: 'Оформлення' },
      ]
    }

    if (route.path.startsWith('/categories/')) {
      const categorySlug = getRouteParam(route.params.slug)
      const category = categories.value.find(item => item.id === categorySlug)

      return category
        ? [home, { title: category.name }]
        : [home]
    }

    if (route.path.startsWith('/products/')) {
      const productSlug = getRouteParam(route.params.slug)
      const product = products.value.find(item => item.slug === productSlug)

      if (!product) {
        return [home]
      }

      const category = categories.value.find(item => item.id === product.categoryId)
      const breadcrumbs: BreadcrumbItem[] = [home]

      if (category) {
        breadcrumbs.push({
          title: category.name,
          to: `/categories/${category.id}`,
        })
      }

      breadcrumbs.push({ title: product.name })

      return breadcrumbs
    }

    return [home]
  })
}
