import type { CreateProductDTO, UpdateProductDTO } from '../interfaces/products'

export const getAllProductsServices = async () => {
  return 'te voy a devolver todo el stock'
}

export const createProductServices = async (data: CreateProductDTO) => {
  return 'te voy a devolver el producto ya creado'
}

export const updateProductServices = async (
  id: number,
  data: UpdateProductDTO
) => {
  return 'te voy a devolver el producto ya updateado'
}

export const deleteProductServices = async (id: number) => {
  return 'Te voy a devolver un valor si pude eliminar o no'
}

export const getProductByIdServices = async (id: number) => {
  return 'Te voy a devolver un producto en especifico'
}
