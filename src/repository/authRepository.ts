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

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

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
        INSERT INTO users (name, lastname, phone, email, password, superadmin) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, lastname, phone, email, superadmin
    `,
      [
        data.name,
        data.lastName,
        data.phone,
        data.email,
        hashedPassword,
        data.superadmin
      ]
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
