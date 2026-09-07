import type { ProductViewMode } from '~/types/product'

export function useProductViewMode() {
  return useState<ProductViewMode>('product-view-mode', () => 'grid')
}
