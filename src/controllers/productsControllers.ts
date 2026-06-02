import type { Request, Response } from 'express'
import type { CreateProductDTO, UpdateProductDTO } from '../interfaces/products'
import {
  getAllProductsServices,
  createProductServices,
  updateProductServices,
  deleteProductServices,
  getProductByIdServices
} from '../services/productsServices'

export const getAllProductsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const storeId = res.locals.currentStoreId as number
    const result = await getAllProductsServices(storeId)

    return res.status(200).json(result.data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al obtener los productos' })
  }
}

export const createProductController = async (req: Request, res: Response) => {
  try {
    const data = res.locals.validateBody as CreateProductDTO
    data.localId = res.locals.currentStoreId as number

    const newProduct = await createProductServices(data)
    return res.status(201).json(newProduct.data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al crear el producto' })
  }
}

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalido' })
    }

    const data = res.locals.validateBody as UpdateProductDTO
    data.localId = res.locals.currentStoreId as number

    const updatedProduct = await updateProductServices(id, data)

    if (!updatedProduct.success) {
      return res.status(400).json({ message: updatedProduct.message })
    }

    return res.status(200).json(updatedProduct.data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al actualizar el producto' })
  }
}

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalido' })
    }
    //si estoy aca es porque el ID es valido
    const storeId = res.locals.currentStoreId as number
    const result = await deleteProductServices(id, storeId)

    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }

    return res.status(200).json({ message: result.message })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error al eliminar el producto' })
  }
}

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalido' })
    }

    const storeId = res.locals.currentStoreId as number

    const result = await getProductByIdServices(id, storeId)

    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }
    return res.status(200).json(result.data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al obtener los productos' })
  }
}
