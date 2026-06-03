import type { Request, Response } from 'express'
import * as storeServices from '../services/storesServices'
import type { CreateStoreDTO } from '../interfaces/stores'

export const getAllStoresController = async (_req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id as number

    res.locals.currentStoreId = null

    const result = await storeServices.getAllStoresServices(userId)
    if (!result.success) {
      return res.status(400).json(result.data)
    }
    return res.status(200).json(result.data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al obtener las tiendas' })
  }
}

export const createStoreController = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id as number
    const data = res.locals.validateBody as CreateStoreDTO

    const result = await storeServices.createStoreServices(data, userId)

    if (!result.success) {
      return res.status(400).json(result.data)
    }

    return res.status(200).json(result.data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al crear la tiendas' })
  }
}
