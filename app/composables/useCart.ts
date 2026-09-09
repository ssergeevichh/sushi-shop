import type { Product } from '~/types/product'

export type CartQuantities = Record<string, number>

export interface CartItem {
  product: Product
  quantity: number
  totalPrice: number
  totalWeight: number
}

export function useCart() {
  const { products } = useCatalog()
  const quantities = useState<CartQuantities>('cart-quantities', () => ({}))
  const isReady = useState<boolean>('cart-is-ready', () => false)

  const cartItems = computed<CartItem[]>(() => {
    return products.value.flatMap((product) => {
      const quantity = getQuantity(product.id)

      if (quantity === 0) {
        return []
      }

      return [{
        product,
        quantity,
        totalPrice: product.price * quantity,
        totalWeight: product.weight * quantity,
      }]
    })
  })

  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.totalPrice, 0)
  })

  const totalWeight = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.totalWeight, 0)
  })

  const isEmpty = computed(() => cartItems.value.length === 0)

  function getQuantity(productId: string) {
    return quantities.value[productId] ?? 0
  }

  function increase(productId: string) {
    quantities.value = {
      ...quantities.value,
      [productId]: getQuantity(productId) + 1,
    }
  }

  function decrease(productId: string) {
    const currentQuantity = getQuantity(productId)

    if (currentQuantity <= 1) {
      remove(productId)
      return
    }

    quantities.value = {
      ...quantities.value,
      [productId]: currentQuantity - 1,
    }
  }

  function remove(productId: string) {
    const nextQuantities = { ...quantities.value }

    delete nextQuantities[productId]
    quantities.value = nextQuantities
  }

  function clearCart() {
    quantities.value = {}
  }

  return {
    cartItems,
    totalItems,
    totalPrice,
    totalWeight,
    isEmpty,
    isReady,
    getQuantity,
    increase,
    decrease,
    remove,
    clearCart,
  }
}
