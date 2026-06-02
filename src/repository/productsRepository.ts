import { pool } from '../config/database'
import type { CreateProductDTO, UpdateProductDTO } from '../interfaces/products'

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

export const updateProduct = async (id: number, data: UpdateProductDTO) => {
  try {
    const query = `
      UPDATE products 
      SET name = $1, description = $2, quantity = $3, category = $4 
      WHERE id = $5 AND id_store = $6 RETURNING *;`
    const values = [
      data.name,
      data.description,
      data.quantity,
      data.category,
      id,
      data.localId
    ]

    const result = await pool.query(query, values)

    if (result.rowCount === 0) {
      return {
        success: false,
        message: 'Error al actualizar el producto desde repository',
        data: null
      }
    }

    return {
      success: true,
      message: 'Producto actulizado correctamente',
      data: result.rows[0]
    }
  } catch (e) {
    console.error('Error al actualizar el producto desde el repository: ', e)
    return {
      success: false,
      message: 'Error al actualizar el producto',
      data: null
    }
  }
}

export const deleteProduct = async (id: number, storeId: number) => {
  try {
    const query = `DELETE FROM products WHERE id = $1 AND id_store = $2 RETURNING *`
    const result = await pool.query(query, [id, storeId])

    if (result.rowCount === 0) {
      return {
        success: false,
        message: 'Error al eliminar el producto desde repository',
        data: null
      }
    }
    return {
      success: true,
      message: 'Producto eliminado correctamente',
      data: null
    }
  } catch (e) {
    console.error('Error al eliminar el producto desde el repository: ', e)
    return {
      success: false,
      message: 'Error al eliminar el producto desde repository',
      data: null
    }
  }
}

export const getProductById = async (id: number, storeId: number) => {
  try {
    const query = `SELECT * FROM products WHERE id = $1 AND id_store = $2`
    const result = await pool.query(query, [id, storeId])

    if (result.rowCount === 0) {
      return {
        success: false,
        message: 'Producto no encontrado',
        data: null
      }
    }
    return {
      success: true,
      message: 'Producto obtenido correctamente',
      data: result.rows[0] || null
    }
  } catch (e) {
    console.error('Error al obtener el producto por ID desde el repository:', e)
    return {
      success: false,
      message: 'Producto no encontrado',
      data: null
    }
  }
}
