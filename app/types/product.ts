export type ProductViewMode = 'grid' | 'list'

export interface Product {
    id: string
    slug: string
    categoryId: string
    name: string
    description: string
    ingredients: string[]
    image: string
    price: number
    oldPrice?: number
    weight: number
    labels: Array<'bestseller' | 'new' | 'spicy'>
    available: boolean
}
