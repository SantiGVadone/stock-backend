import type { Request, Response, NextFunction } from 'express'

export const checkRole = (allowedRoles: string[]) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user // Los datos que inyectó authRequired

    if (!user.superadmin && !user.role) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    // 1. Verificamos si el rol del usuario está en la lista permitida
    if (allowedRoles.includes(user.role as string) || user.superadmin) {
      next()
    }

    // 2. Si no es superadmin ni tiene el rol permitido, afuera
    return res.status(403).json({
      message: `Acceso denegado. Se requiere rango: ${allowedRoles.join(' o ')}`
    })
  }
}
