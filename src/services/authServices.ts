import type { loginDTO, registerDTO, refreshDTO, changePasswordDTO } from '../interfaces/auth'
import * as authRepository from '../repository/authRepository'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, parseDuration } from '../config/constants'

export const loginServices = async (data: loginDTO) => {
  try {
    const result = await authRepository.login(data)
    if (!result.success || !result.data) {
      return { success: false, message: 'Error al iniciar sesion', data: null }
    }

    const stores = await authRepository.getUserStores(Number(result.data.id))

    const userData = {
      ...result.data,
      stores
    }

    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
      throw new Error('Falta configurar la variable de entorno JWT_SECRET')
    }

    const accessToken = jwt.sign(
      { id: userData.id, superadmin: userData.superadmin },
      secretKey,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    )

    const refreshToken = crypto.randomBytes(64).toString('hex')
    const refreshExpiresAt = new Date(Date.now() + parseDuration(REFRESH_TOKEN_EXPIRY))

    await authRepository.createRefreshToken(
      userData.id as number,
      refreshToken,
      refreshExpiresAt
    )

    return {
      success: true,
      message: result.message,
      data: {
        ...userData,
        accessToken,
        refreshToken
      }
    }
  } catch (error) {
    return { success: false, message: 'Error al iniciar sesion', data: null }
  }
}

export const registerServices = async (data: registerDTO) => {
  try {
    const result = await authRepository.register(data)
    return result
  } catch (error) {
    return {
      success: false,
      message: 'Error al registrar el usuario',
      data: null
    }
  }
}

export const refreshTokenService = async (data: refreshDTO) => {
  try {
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
      throw new Error('Falta configurar la variable de entorno JWT_SECRET')
    }

    const tokenResult = await authRepository.findValidRefreshToken(
      data.refreshToken
    )

    if (!tokenResult.success || !tokenResult.data) {
      return { success: false, message: tokenResult.message, data: null }
    }

    const storedToken = tokenResult.data

    await authRepository.revokeRefreshToken(data.refreshToken)

    const newAccessToken = jwt.sign(
      { id: storedToken.user_id, superadmin: storedToken.superadmin },
      secretKey,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    )

    const newRefreshToken = crypto.randomBytes(64).toString('hex')
    const refreshExpiresAt = new Date(Date.now() + parseDuration(REFRESH_TOKEN_EXPIRY))

    await authRepository.createRefreshToken(
      storedToken.user_id as number,
      newRefreshToken,
      refreshExpiresAt
    )

    return {
      success: true,
      message: 'Tokens renovados correctamente',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    }
  } catch (error) {
    console.error('Error en refreshTokenService:', error)
    return { success: false, message: 'Error al renovar tokens', data: null }
  }
}

export const changePasswordService = async (data: changePasswordDTO) => {
  return { success: false, message: 'No implementado', data: null }
}
