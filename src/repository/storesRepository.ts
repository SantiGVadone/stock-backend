import { pool } from '../config/database'
import type {
  CreateStoreDTO,
  Store,
  UpdateStoreDTO
} from '../interfaces/stores'
export const getAllStores = async (userId: number) => {
  try {
    const query = `SELECT s.id AS storeId, s.name AS storeName, us.rol as userRol from stores s JOIN users_stores us ON s.id = us.id_store WHERE us.id_user = $1`
    const result = await pool.query(query, [userId])
    return {
      success: true,
      message: 'Tiendas obtenidas correctamente',
      data: result.rows
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al obtener las tiendas desde repository',
      data: null
    }
  }
}

export const createStore = async (
  data: CreateStoreDTO
): Promise<{ success: boolean; message: string; data: Store | null }> => {
  try {
    const query = `INSERT INTO stores (name, location, phone) VALUES ( $1 , $2, $3) RETURNING *;`
    const result = await pool.query(query, [
      data.name,
      data.location,
      data.phone
    ])
    return {
      success: true,
      message: 'Tiendas obtenidas correctamente',
      data: result.rows[0]
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al obtener las tiendas desde repository',
      data: null
    }
  }
}

export const updateStore = async (
  data: UpdateStoreDTO,
  currentStoreId: number
) => {
  try {
    // aca tiene que ir la consulta para poder actualizar las db,
    // TENIENDO EN CUENTA QUE SOLO EL JEFE PUEDE ACTUALIZAR LA STORE
    const query = `UPDATE stores SET name = $1, location = $2, phone= $3 WHERE id = $4 RETURNING *;`
    const result = await pool.query(query, [
      data.name,
      data.location,
      data.phone,
      currentStoreId
    ])
    return {
      success: true,
      message: 'Tienda actualizada correctamente',
      data: result.rows[0]
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al actualizar la tienda desde repository',
      data: null
    }
  }
}

export const deleteStore = async (id: number) => {
  try {
    const query = `DELETE FROM stores WHERE id = $1 RETURNING *`
    const result = await pool.query(query, [id])
    if (result.rowCount === 0) {
      return {
        success: false,
        message: 'Error al eliminar la tienda desde repository',
        data: null
      }
    }
    return {
      success: true,
      message: 'Tienda eliminada correctamente',
      data: null
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al eliminar la tienda desde repository',
      data: null
    }
  }
}

export const getStoreById = async (userId: number, storeId: number) => {
  try {
    const query = `SELECT s.id AS storeId, s.name AS storeName, us.rol as userRol from stores s JOIN users_stores us ON s.id = us.id_store WHERE us.id_user = $1 AND us.id_store = $2;`
    const result = await pool.query(query, [userId, storeId])
    return {
      success: true,
      message: 'Tienda obtenida por ID correctamente',
      data: result.rows
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al obtener la tienda por ID desde repository',
      data: null
    }
  }
}
