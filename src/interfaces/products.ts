export interface Product {
  id: string
  nombre: string
  descripcion: string
  cantidad: number
  categoria?: string
}

export type CreateProductDTO = Omit<Product, 'id'>

export type UpdateProductDTO = Partial<CreateProductDTO>
