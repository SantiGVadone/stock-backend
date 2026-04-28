import type { Request, Response } from 'express'
import type { Product } from '../models/Producto'
import {
  //UpdateProductSchema,
  productSchema
} from '../schemas/productoSchema'

import stockInicial from '../mocks/stock.json' with { type: 'json' }

const stock: Product[] = stockInicial ?? []

export const 

export const crearProducts = async (req: Request, res: Response) => {
  try {
    const data = productSchema.safeParse(req.body)

    if (!data.success) {
      return res.status(400).json({ error: data.error })
    }

    console.log(data)
    console.log(stock)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear el producto' })
  }
}
