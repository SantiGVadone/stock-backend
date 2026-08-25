import { pool } from '../config/database'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
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
    console.error('Error al iniciar sesión: ', e)
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

export const createRefreshToken = async (
  userId: number,
  refreshToken: string,
  expiresAt: Date
) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex')

    const result = await pool.query(
      `
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, expires_at, created_at
      `,
      [userId, tokenHash, expiresAt]
    )

    return {
      success: true,
      data: result.rows[0]
    }
  } catch (e) {
    console.error('Error al crear refresh token: ', e)
    return {
      success: false,
      message: 'Error al crear refresh token',
      data: null
    }
  }
}

export const findValidRefreshToken = async (refreshToken: string) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex')

    const result = await pool.query(
      `
      SELECT rt.*, u.email, u.superadmin
      FROM refresh_tokens rt
      INNER JOIN users u ON rt.user_id = u.id
      WHERE rt.token_hash = $1
        AND rt.revoked = FALSE
        AND rt.expires_at > NOW()
      `,
      [tokenHash]
    )

    if (result.rowCount === 0) {
      return {
        success: false,
        message: 'Refresh token inválido o expirado',
        data: null
      }
    }

    return {
      success: true,
      data: result.rows[0]
    }
  } catch (e) {
    console.error('Error al buscar refresh token: ', e)
    return {
      success: false,
      message: 'Error al buscar refresh token',
      data: null
    }
  }
}

export const revokeRefreshToken = async (refreshToken: string) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex')

    await pool.query(
      `
      UPDATE refresh_tokens
      SET revoked = TRUE
      WHERE token_hash = $1
      `,
      [tokenHash]
    )

    return { success: true }
  } catch (e) {
    console.error('Error al revocar refresh token: ', e)
    return { success: false, message: 'Error al revocar refresh token' }
  }
}

export const revokeAllUserRefreshTokens = async (userId: number) => {
  try {
    await pool.query(
      `
      UPDATE refresh_tokens
      SET revoked = TRUE
      WHERE user_id = $1 AND revoked = FALSE
      `,
      [userId]
    )

    return { success: true }
  } catch (e) {
    console.error('Error al revocar todos los refresh tokens: ', e)
    return { success: false, message: 'Error al revocar refresh tokens' }
  }
}

export const updatePassword = async (
  userId: number,
  hashedPassword: string
) => {
  try {
    await pool.query(
      `
      UPDATE users
      SET password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [hashedPassword, userId]
    )

    return { success: true }
  } catch (e) {
    console.error('Error al actualizar contraseña: ', e)
    return { success: false, message: 'Error al actualizar contraseña' }
  }
}

export const findByEmail = async (email: string) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email
    ])
    if (result.rowCount === 0) {
      return { success: false, message: 'Usuario no encontrado', data: null }
    }
    return { success: true, data: result.rows[0] }
  } catch (e) {
    console.error('Error al buscar usuario por email: ', e)
    return { success: false, message: 'Error al buscar usuario', data: null }
  }
}

export const findByVerificationToken = async (tokenHash: string) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE email_verification_token = $1
        AND email_verification_expires > NOW()
        AND email_verified = FALSE
      `,
      [tokenHash]
    )
    if (result.rowCount === 0) {
      return {
        success: false,
        message: 'Token de verificación inválido o expirado',
        data: null
      }
    }
    return { success: true, data: result.rows[0] }
  } catch (e) {
    console.error('Error al buscar usuario por token de verificación: ', e)
    return { success: false, message: 'Error al buscar usuario', data: null }
  }
}

export const markEmailVerified = async (userId: number) => {
  try {
    await pool.query(
      `
      UPDATE users
      SET email_verified = TRUE,
          email_verification_token = NULL,
          email_verification_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [userId]
    )
    return { success: true }
  } catch (e) {
    console.error('Error al marcar email como verificado: ', e)
    return { success: false, message: 'Error al verificar email' }
  }
}

export const updateVerificationToken = async (
  userId: number,
  tokenHash: string,
  expiresAt: Date
) => {
  try {
    await pool.query(
      `
      UPDATE users
      SET email_verification_token = $1,
          email_verification_expires = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      [tokenHash, expiresAt, userId]
    )
    return { success: true }
  } catch (e) {
    console.error('Error al actualizar token de verificación: ', e)
    return {
      success: false,
      message: 'Error al actualizar token de verificación'
    }
  }
}

export const findByResetToken = async (tokenHash: string) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE reset_password_token = $1
        AND reset_password_expires > NOW()
      `,
      [tokenHash]
    )
    if (result.rowCount === 0) {
      return {
        success: false,
        message: 'Token de recuperación inválido o expirado',
        data: null
      }
    }
    return { success: true, data: result.rows[0] }
  } catch (e) {
    console.error('Error al buscar usuario por token de recuperación: ', e)
    return { success: false, message: 'Error al buscar usuario', data: null }
  }
}

export const updateResetToken = async (
  userId: number,
  tokenHash: string,
  expiresAt: Date
) => {
  try {
    await pool.query(
      `
      UPDATE users
      SET reset_password_token = $1,
          reset_password_expires = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      [tokenHash, expiresAt, userId]
    )
    return { success: true }
  } catch (e) {
    console.error('Error al actualizar token de recuperación: ', e)
    return {
      success: false,
      message: 'Error al actualizar token de recuperación'
    }
  }
}

export const clearResetToken = async (userId: number) => {
  try {
    await pool.query(
      `
      UPDATE users
      SET reset_password_token = NULL,
          reset_password_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [userId]
    )
    return { success: true }
  } catch (e) {
    console.error('Error al limpiar token de recuperación: ', e)
    return { success: false, message: 'Error al limpiar token de recuperación' }
  }
}

export const updatePasswordById = async (
  userId: number,
  hashedPassword: string
) => {
  try {
    await pool.query(
      `
      UPDATE users
      SET password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [hashedPassword, userId]
    )
    return { success: true }
  } catch (e) {
    console.error('Error al actualizar contraseña por ID: ', e)
    return { success: false, message: 'Error al actualizar contraseña' }
  }
}
