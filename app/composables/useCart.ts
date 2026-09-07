type CartQuantities = Record<string, number>

export function useCart() {
  const quantities = useState<CartQuantities>('cart-quantities', () => ({}))

  const totalItems = computed(() => {
    return Object.values(quantities.value).reduce((total, quantity) => total + quantity, 0)
  })

  function getQuantity(productId: string) {
    return quantities.value[productId] ?? 0
  }

  function increase(productId: string) {
    quantities.value[productId] = getQuantity(productId) + 1
  }

  function decrease(productId: string) {
    const currentQuantity = getQuantity(productId)

    if (currentQuantity <= 1) {
      remove(productId)
      return
    }

    quantities.value[productId] = currentQuantity - 1
  }

  function remove(productId: string) {
    const nextQuantities = { ...quantities.value }

    delete nextQuantities[productId]
    quantities.value = nextQuantities
  }

  return {
    totalItems,
    getQuantity,
    increase,
    decrease,
    remove,
  }
}
