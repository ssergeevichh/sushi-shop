import type { CartQuantities } from '~/composables/useCart'

const CART_STORAGE_KEY = 'rollin-cart-v2'

function parseStoredCart(value: string): CartQuantities {
  const parsedValue: unknown = JSON.parse(value)

  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(parsedValue)
      .filter((entry): entry is [string, number] => {
        const [productId, quantity] = entry

        return Boolean(productId)
          && typeof quantity === 'number'
          && Number.isInteger(quantity)
          && quantity > 0
      }),
  )
}

export default defineNuxtPlugin(() => {
  const quantities = useState<CartQuantities>('cart-quantities', () => ({}))
  const isReady = useState<boolean>('cart-is-ready', () => false)

  onNuxtReady(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)

      if (storedCart) {
        quantities.value = parseStoredCart(storedCart)
      }
    }
    catch {
      // The cart still works in memory when browser storage is unavailable.
    }
    finally {
      isReady.value = true
    }

    watch(
      quantities,
      (value) => {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value))
        }
        catch {
          // The cart still works in memory when browser storage is unavailable.
        }
      },
      { deep: true },
    )
  })
})
