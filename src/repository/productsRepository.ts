import { pool } from '../config/database'
import type { CreateProductDTO } from '../interfaces/products'

export const getAllProducts = async (storeId: number) => {
  try {
    const query = 'SELECT * FROM products WHERE id_store = $1'
    const result = await pool.query(query, [storeId])
    return {
      success: true,
      message: 'Productos listadoscorrectamente',
      data: result.rows
    }
  } catch (e) {
    console.error('Error al traer productos desde el repository: ', e)
    return {
      success: false,
      message: 'Error al traer los productos',
      data: null
    }
  }
}

export const createProduct = async (data: CreateProductDTO) => {
  try {
    const query = `INSERT INTO products (name, description, quantity, category, id_store)
                                          VALUES ($1 , $2         , $3      ,       $4, $5) RETURNING *;`

    const values = [
      data.name,
      data.description,
      data.quantity,
      data.category,
      data.localId
    ]

    const result = await pool.query(query, values)

    return {
      success: true,
      message: 'Producto creado correctamente',
      data: result.rows
    }
  } catch (e) {
    console.error('Error al crear productos desde el repository: ', e)
    return {
      success: false,
      message: 'Error al crear los productos',
      data: null
    }
  }
}
