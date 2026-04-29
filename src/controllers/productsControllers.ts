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
    const result = await getAllProductsServices()

    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los productos' })
  }
}

export const createProductController = async (req: Request, res: Response) => {
  try {
    const data = (res.locals.validateBody ?? req.body) as CreateProductDTO
    //tomo los datos ya validados

    const newProduct = await createProductServices(data)
    res.status(201).json(newProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear el producto' })
  }
}

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalido' })
    }

    const data = (res.locals.validateBody ?? req.params) as UpdateProductDTO

    const updatedProduct = await updateProductServices(id, data)

    if (!updatedProduct) {
      return res.status(400).json({ message: 'Producto no encontrado' })
    }

    return res.status(200).json(updatedProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el producto' })
  }
}

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalido' })
    }
    //si estoy aca es porque el ID es valido
    const result = await deleteProductServices(id)
    if (!result) {
      return res.status(400).json({ message: 'Producto no encontrado' })
    }
    return res.status(200).json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al eliminar el producto' })
  }
}

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalido' })
    }

    const result = await getProductByIdServices(id)

    if (!result) {
      return res.status(400).json({ message: 'Producto no encontrado' })
    }
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los productos' })
  }
}
