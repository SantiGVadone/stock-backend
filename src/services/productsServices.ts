import { pool } from '../config/database'
import type { CreateProductDTO, UpdateProductDTO } from '../interfaces/products'

export const getAllProductsServices = async () => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC;')
    return result.rows
  } catch (error) {
    console.error('Error al traer productos', error)
    throw error
  }
}

export const createProductServices = async (data: CreateProductDTO) => {
  try {
    const query = `INSERT INTO products (name, description, quantity, category)
                                  VALUES ($1 , $2         , $3      ,       $4) RETURNING *;`

    const values = [data.name, data.description, data.quantity, data.category]

    const result = await pool.query(query, values)

    return result.rows[0]
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
    const query = `
      UPDATE products 
      SET name = $1, description = $2, quantity = $3, category = $4 
      WHERE id = $5 RETURNING *;`
    const values = [
      data.name,
      data.description,
      data.quantity,
      data.category,
      id
    ]
    const result = await pool.query(query, values)
    return result.rows[0]
  } catch (error) {
    console.error('Error al actualizar el producto', error)
    throw error
  }
}

export const deleteProductServices = async (id: number) => {
  const query = 'DELETE FROM products WHERE id = $1'

  const result = await pool.query(query, [id])
  if (result.rowCount === 0) {
    return { message: 'Producto no encontrado o imposible de eliminar' }
  }
  return { message: 'Producto eliminado correctamente' }
}

export const getProductByIdServices = async (id: number) => {
  try {
    const query = 'SELECT * FROM products WHERE id = $1  ORDER BY id ASC;'
    const result = await pool.query(query, [id])
    return result.rows[0]
  } catch (error) {
    console.error('Error al traer el producto', error)
    throw error
  }
}
