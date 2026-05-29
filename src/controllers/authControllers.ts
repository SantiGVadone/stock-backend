import type { Request, Response } from 'express'
import * as authService from '../services/authServices'
import type { loginDTO, registerDTO } from '../interfaces/auth'

export const register = async (_req: Request, res: Response) => {
  try {
    const data: registerDTO = res.locals.validateBody
    // console.log('Data recibida en el controlador de register: ', data)
    //  la info esta llegando bien
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
    // console.log('Data recibida en el controlador de login: ', data)
    //  la info esta llegando bien
    const result = await authService.loginServices(data)

    if (!result.success) {
      return res.status(400).json({ message: result.message })
    } else {
      return res.status(201).json({ data: result.data })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}
