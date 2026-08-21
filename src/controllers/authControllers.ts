import type { Request, Response } from 'express'
import * as authService from '../services/authServices'
import type {
  changePasswordDTO,
  loginDTO,
  registerDTO,
  refreshDTO
} from '../interfaces/auth'

export const register = async (_req: Request, res: Response) => {
  try {
    const data: registerDTO = res.locals.validateBody
    const result = await authService.registerServices(data)

    if (!result.success) {
      return res.status(400).json({ message: result.message })
    } else {
      return res.status(201).json({ message: result.message })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const login = async (_req: Request, res: Response) => {
  try {
    const data: loginDTO = res.locals.validateBody

    const result = await authService.loginServices(data)

    if (!result.success || !result.data) {
      return res.status(400).json({ message: result.message })
    }

    return res.status(200).json({
      message: result.message,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      user: {
        id: result.data.id,
        email: result.data.email,
        name: result.data.name,
        lastName: result.data.lastName,
        phone: result.data.phone,
        superadmin: result.data.superadmin,
        stores: result.data.stores
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const changePassword = async (_req: Request, res: Response) => {
  try {
    const secretKey = process.env.JWT_SECRET

    if (!secretKey) {
      throw new Error('Falta configurar la variable de entorno JWT_SECRET')
    }

    const data: changePasswordDTO = res.locals.validateBody

    const result = await authService.changePasswordService(data)

    if (!result.success || !result.data) {
      return res.status(400).json({ message: result.message })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const refresh = async (_req: Request, res: Response) => {
  try {
    const data: refreshDTO = res.locals.validateBody

    const result = await authService.refreshTokenService(data)

    if (!result.success || !result.data) {
      return res.status(401).json({ message: result.message })
    }

    return res.status(200).json({
      message: result.message,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}
