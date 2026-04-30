export interface Product {
  id: string
  name: string
  description: string
  quantity: number
  category?: string
}

export type CreateProductDTO = Omit<Product, 'id'>

export type UpdateProductDTO = Partial<CreateProductDTO>
