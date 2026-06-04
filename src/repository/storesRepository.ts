import { pool } from '../config/database'
import type { CreateStoreDTO, Store, UpdateStoreDTO } from '../interfaces/stores'
export const getAllStores = async (userId: number) => {
  try {
    const query = `SELECT s.id AS storeId, s.name AS storeName from stores s JOIN users_stores us ON s.id = us.id_store WHERE us.id_user = $1`
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

export const updateStore = async (data: UpdateStoreDTO, currentStoreId: number) => {
  try{
    const query = `UPDATE stores SET name = $1, location = $2, phone= $3 WHERE id = $4 RETURNING *;` // aca tiene que ir la consulta para poder actualizar las db, TENIENDO EN CUENTA QUE SOLO EL JEFE PUEDE ACTUALIZAR LA STORE
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
  }catch(error){
    console.error(error)
    return {
      success: false,
      message: 'Error al actualizar la tienda desde repository',
      data: null
    }
  }
}