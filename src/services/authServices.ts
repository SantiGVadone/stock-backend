import type {
  loginDTO,
  registerDTO,
  refreshDTO,
  changePasswordDTO,
  verifyEmailDTO,
  resendVerificationDTO,
  forgotPasswordDTO,
  resetPasswordDTO
} from '../interfaces/auth'
import * as authRepository from '../repository/authRepository'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  parseDuration,
  SALT_ROUNDS
} from '../config/constants'

// variables a remplazar:
// EMAIL_VERIFICATION_EXPIRY_HOURS = 24
// PASSWORD_RESET_EXPIRY_HOURS = 1
// SMTP_HOST = 'smtp.example.com'
// SMTP_PORT = 587
// SMTP_USER = 'user@example.com'
// SMTP_PASS = 'password'
// EMAIL_FROM = 'noreply@example.com'
// FRONTEND_URL = 'http://localhost:3000'

const EMAIL_VERIFICATION_EXPIRY_HOURS = 24
const PASSWORD_RESET_EXPIRY_HOURS = 1

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
    const refreshExpiresAt = new Date(
      Date.now() + parseDuration(REFRESH_TOKEN_EXPIRY)
    )

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
    const refreshExpiresAt = new Date(
      Date.now() + parseDuration(REFRESH_TOKEN_EXPIRY)
    )

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

export const changePasswordService = async (
  userId: number,
  data: changePasswordDTO
) => {
  try {
    const userResult = await authRepository.findUserById(userId)
    if (!userResult.success || !userResult.data) {
      return { success: false, message: 'Usuario no encontrado', data: null }
    }

    const user = userResult.data
    const isPasswordValid = await bcrypt.compare(data.oldPass, user.password)

    if (!isPasswordValid) {
      return { success: false, message: 'Contraseña actual incorrecta', data: null }
    }

    const hashedPassword = await bcrypt.hash(data.newPass, SALT_ROUNDS)
    await authRepository.updatePassword(userId, hashedPassword)
    await authRepository.revokeAllUserRefreshTokens(userId)

    return {
      success: true,
      message: 'Contraseña actualizada correctamente',
      data: null
    }
  } catch (error) {
    console.error('Error en changePasswordService:', error)
    return {
      success: false,
      message: 'Error al cambiar contraseña',
      data: null
    }
  }
}

export const verifyEmailService = async (data: verifyEmailDTO) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(data.token)
      .digest('hex')

    const userResult = await authRepository.findByVerificationToken(tokenHash)
    if (!userResult.success || !userResult.data) {
      return { success: false, message: userResult.message, data: null }
    }

    await authRepository.markEmailVerified(userResult.data.id as number)

    return {
      success: true,
      message: 'Email verificado correctamente',
      data: null
    }
  } catch (error) {
    console.error('Error en verifyEmailService:', error)
    return { success: false, message: 'Error al verificar email', data: null }
  }
}

export const resendVerificationService = async (
  data: resendVerificationDTO
) => {
  try {
    const userResult = await authRepository.findByEmail(data.email)
    if (!userResult.success || !userResult.data) {
      return {
        success: true,
        message: 'Si el email existe, se envió el correo de verificación',
        data: null
      }
    }

    const user = userResult.data
    if (user.email_verified) {
      return {
        success: true,
        message: 'El email ya está verificado',
        data: null
      }
    }

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(
      Date.now() + EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000
    )

    await authRepository.updateVerificationToken(
      user.id as number,
      tokenHash,
      expiresAt
    )

    await sendVerificationEmail(user.email as string, token)

    return {
      success: true,
      message: 'Si el email existe, se envió el correo de verificación',
      data: null
    }
  } catch (error) {
    console.error('Error en resendVerificationService:', error)
    return {
      success: false,
      message: 'Error al reenviar verificación',
      data: null
    }
  }
}

export const forgotPasswordService = async (data: forgotPasswordDTO) => {
  try {
    const userResult = await authRepository.findByEmail(data.email)
    if (!userResult.success || !userResult.data) {
      return {
        success: true,
        message: 'Si el email existe, se envió el correo de recuperación',
        data: null
      }
    }

    const user = userResult.data
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(
      Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000
    )

    await authRepository.updateResetToken(
      user.id as number,
      tokenHash,
      expiresAt
    )

    await sendPasswordResetEmail(user.email as string, token)

    return {
      success: true,
      message: 'Si el email existe, se envió el correo de recuperación',
      data: null
    }
  } catch (error) {
    console.error('Error en forgotPasswordService:', error)
    return {
      success: false,
      message: 'Error al solicitar recuperación',
      data: null
    }
  }
}

export const resetPasswordService = async (data: resetPasswordDTO) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(data.token)
      .digest('hex')

    const userResult = await authRepository.findByResetToken(tokenHash)
    if (!userResult.success || !userResult.data) {
      return { success: false, message: userResult.message, data: null }
    }

    const user = userResult.data
    const hashedPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS)

    await authRepository.updatePasswordById(user.id as number, hashedPassword)
    await authRepository.clearResetToken(user.id as number)
    await authRepository.revokeAllUserRefreshTokens(user.id as number)

    return {
      success: true,
      message: 'Contraseña restablecida correctamente',
      data: null
    }
  } catch (error) {
    console.error('Error en resetPasswordService:', error)
    return {
      success: false,
      message: 'Error al restablecer contraseña',
      data: null
    }
  }
}

async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`

  console.log('=== EMAIL DE VERIFICACIÓN (MOCK) ===')
  console.log(`Para: ${email}`)
  console.log(`Asunto: Verifica tu email`)
  console.log(`Enlace: ${verificationUrl}`)
  console.log('=====================================')

  // TODO: Implementar envío real con nodemailer
  // const nodemailer = require('nodemailer')
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  // })
  // await transporter.sendMail({
  //   from: process.env.EMAIL_FROM,
  //   to: email,
  //   subject: 'Verifica tu email',
  //   html: `<a href="${verificationUrl}">Verificar email</a>`
  // })
}

async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`

  console.log('=== EMAIL DE RECUPERACIÓN (MOCK) ===')
  console.log(`Para: ${email}`)
  console.log(`Asunto: Recupera tu contraseña`)
  console.log(`Enlace: ${resetUrl}`)
  console.log('=====================================')

  // TODO: Implementar envío real con nodemailer
}
