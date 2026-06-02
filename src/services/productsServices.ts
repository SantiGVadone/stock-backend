import type { CreateProductDTO, UpdateProductDTO } from '../interfaces/products'
import * as productRepository from '../repository/productsRepository'

export const getAllProductsServices = async (storeId: number) => {
  try {
    const result = await productRepository.getAllProducts(storeId)

    return {
      success: result.success,
      message: result.message,
      data: result.data
    }
  } catch (error) {
    console.error('Error al traer los productos', error)
    throw error
  }
}

export const createProductServices = async (data: CreateProductDTO) => {
  try {
    const result = await productRepository.createProduct(data)

    return {
      success: result.success,
      message: result.message,
      data: result.data
    }
  } catch (error) {
    console.error('Error al crear el producto', error)
    throw error
  }
}

export const updateProductServices = async (
  id: number,
  data: UpdateProductDTO
) => {
  try {
    const existingProduct = await productRepository.getProductById(
      id,
      Number(data.localId)
    )
    if (!existingProduct) {
      return {
        success: false,
        message: 'Producto no encontrado',
        data: null
      }
    }

    const result = await productRepository.updateProduct(id, data)

    return {
      success: result.success,
      message: result.message,
      data: result.data
    }
  } catch (error) {
    console.error('Error al actualizar el producto', error)
    throw error
  }
}

export const deleteProductServices = async (id: number, storeId: number) => {
  try {
    const existingProduct = await productRepository.getProductById(
      id,
      Number(storeId)
    )
    if (!existingProduct) {
      return {
        success: false,
        message: 'Producto no encontrado',
        data: null
      }
    }
    const result = await productRepository.deleteProduct(id, storeId)
    if (!result.success) {
      return {
        success: false,
        message: 'Error al eliminar el producto desde services',
        data: null
      }
    }

    return {
      success: true,
      message: 'Producto eliminado correctamente',
      data: result //cuando se elimina el producto no se devuelve data, pero dejo el result por si quiero usar el message mas adelante
    }
  } catch (error) {
    console.error('Error al eliminar el producto desde services', error)
    return {
      success: false,
      message: 'Error al eliminar el producto desde services',
      data: null
    }
  }
}

export const getProductByIdServices = async (id: number, storeId: number) => {
  try {
    const result = await productRepository.getProductById(id, storeId)
    return {
      success: true,
      message: 'Producto obtenido correctamente',
      data: result.data
    }
  } catch (error) {
    console.error('Error al traer el producto', error)
    return {
      success: false,
      message: 'Error al obtener el producto desde services',
      data: null
    }
  }
}
