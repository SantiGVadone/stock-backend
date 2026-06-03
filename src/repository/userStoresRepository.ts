import { pool } from '../config/database'
import type { Store } from '../interfaces/stores'

export const newUserStores = async (
  data: Store,
  userId: number,
  rol: string
) => {
  try {
    const query = `INSERT INTO users_stores (id_user, id_store, rol) VALUES ( $1 , $2, $3) RETURNING *;`
    const result = await pool.query(query, [userId, data.id, rol])
    return {
      success: true,
      message: 'Tiendas obtenidas correctamente',
      data: result.rows
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al crear la relacion de users_stores',
      data: null
    }
  }
}
