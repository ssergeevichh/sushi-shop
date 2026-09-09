import type { Category } from '~/types/category'
import type { Product } from '~/types/product'

const ALL_CATEGORY: Category = {
  id: 'all',
  name: 'Усі',
  description: 'Усі роли, сети та гарячі позиції ROLLIN’.',
  image: '/images/categories/all.webp',
}

export function useCatalog() {
  const categories = useState<Category[]>('catalog-categories', () => [])
  const products = useState<Product[]>('catalog-products', () => [])
  const isLoaded = useState<boolean>('catalog-is-loaded', () => false)

  return {
    categories,
    products,
    isLoaded,
  }
}

export async function loadCatalog() {
  const { categories, products, isLoaded } = useCatalog()

  if (isLoaded.value) {
    return
  }

  const supabase = useSupabase()
  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true }),
  ])

  if (categoriesResult.error || productsResult.error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Не вдалося завантажити меню',
    })
  }

  const categorySlugById = new Map(
    categoriesResult.data.map(category => [category.id, category.slug]),
  )

  categories.value = [
    ALL_CATEGORY,
    ...categoriesResult.data.map(category => ({
      id: category.slug,
      name: category.name,
      description: category.description,
      image: category.image_path,
    })),
  ]

  products.value = productsResult.data.flatMap((product) => {
    const categoryId = categorySlugById.get(product.category_id)

    if (!categoryId) {
      return []
    }

    return [{
      id: product.id,
      slug: product.slug,
      categoryId,
      name: product.name,
      description: product.description,
      ingredients: product.ingredients,
      image: product.image_path,
      price: product.price,
      oldPrice: product.old_price ?? undefined,
      weight: product.weight,
      labels: product.labels,
      available: product.is_available,
    }]
  })

  isLoaded.value = true
}
