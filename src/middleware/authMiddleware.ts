import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: number
  superadmin: boolean
}

export const authRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Token no proporcionado, autorizacion denegada' })
    }

    const secretKey = process.env.JWT_SECRET || 'default_secret_key'
    const decoded = jwt.verify(token, secretKey) as UserPayload

    res.locals.user = {
      id: decoded.id,
      superadmin: decoded.superadmin
    }

    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Token invalido, autorizacion denegada' })
  }
}
