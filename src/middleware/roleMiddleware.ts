import type { Request, Response, NextFunction } from 'express'
import { pool } from '../config/database'

export const checkStorePermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user // Los datos que inyectó authRequired
    if (user.superadmin) {
      res.locals.currentRole = 'superadmin'

      // Si el superadmin mandó un local para trabajar, lo guardamos; si no, queda en null
      res.locals.currentStoreId = req.headers['x-store-id']
        ? Number(req.headers['x-store-id'])
        : null
      next()
    }

    const storeIdHeader = req.headers['x-store-id']

    if (!storeIdHeader) {
      return res.status(400).json({
        message:
          'No se ha proporcionado el ID de la tienda en el encabezado x-store-id'
      })
    }

    const storeId = Number(storeIdHeader)

    if (isNaN(storeId)) {
      return res.status(400).json({
        message: 'El ID de la tienda debe ser un numero valido'
      })
    }
    const query = `
      SELECT rol 
      FROM users_stores 
      WHERE id_user = $1 AND id_store = $2
    `
    const result = await pool.query(query, [user.id, storeId])

    if (result.rowCount === 0) {
      return res.status(403).json({
        message: 'Acceso denegado: No tenés relación comercial con este local'
      })
    }
    const userRelation = result.rows[0] // Esto contiene { rol: 'jefe' o 'empleado' }

    res.locals.currentStoreId = storeId
    res.locals.currentRole = userRelation.rol
    next()
  } catch (e) {
    console.error('Error en checkStorePermission:', e)
    return res
      .status(500)
      .json({ message: 'Error interno al validar permisos del local' })
  }
}
