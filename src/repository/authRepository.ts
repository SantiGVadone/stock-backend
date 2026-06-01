import { pool } from '../config/database'
import bcrypt from 'bcrypt'
import type { loginDTO, registerDTO } from '../interfaces/auth'

export const login = async (data: loginDTO) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      data.email
    ])
    if (result.rowCount === 0) {
      return { success: false, message: 'Email no registrado' }
    }

    const user = result.rows[0]

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password as string
    )

    if (!isPasswordValid) {
      return { success: false, message: 'Contraseña incorrecta' }
    }

    return {
      success: true,
      message: 'Usuario logueado correctamente',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.last_name,
        phone: user.phone,
        superadmin: user.superadmin
      }
    }
  } catch (e) {
    return { success: false, message: 'Error al iniciar sesión', data: null }
  }
}

export const register = async (data: registerDTO) => {
  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [data.email]
    )

    if (existingUser.rowCount !== 0) {
      return { success: false, message: 'Email ya registrado', data: null }
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const newUser = await pool.query(
      `
        INSERT INTO users (name, lastname, phone, email, password) 
        VALUES ($1, $2, $3, $4, $5) RETURNING id, name, lastname, phone, email, superadmin;
    `,
      [data.name, data.lastName, data.phone, data.email, hashedPassword]
    )

    const user = newUser.rows[0]

    return {
      success: true,
      message: 'Usuario registrado con exito',
      data: user
    }
  } catch (e) {
    return {
      success: false,
      message: 'Error al registrar el usuario',
      data: null
    }
  }
}

export const getUserStores = async (userId: number) => {
  try {
    const query = `SELECT s.id, s.name, us.rol 
      FROM stores s
      INNER JOIN users_stores us ON s.id = us.id_store
      WHERE us.id_user = $1`

    const result = await pool.query(query, [userId])
    if (result.rowCount === 0) {
      return {
        success: false,
        message: 'No se encontraron tiendas para este usuario',
        data: null
      }
    }
    return result.rows
  } catch (e) {
    console.error('Error al obtener las tiendas del usuario: ', e)
    return {
      success: false,
      message: 'Error al obtener las tiendas del usuario',
      data: null
    }
  }
}
