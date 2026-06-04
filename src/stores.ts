import { Router } from 'express'
import { validateBody } from '../middleware/validateMiddleware'
import { authRequired } from '../middleware/authMiddleware'
import { storeSchema, updateStoreSchema } from '../schemas/storeSchema'
import {
  getAllStoresController,
  createStoreController,
  updateStoreController
} from '../controllers/storesControllers'
import { checkStorePermission } from '../middleware/roleMiddleware'

const router = Router()

//get para listar todas las stores a las que el usuario tiene acceso
router.get('/', authRequired, checkStorePermission, getAllStoresController)

//post para crear una store
router.post('/', authRequired, checkStorePermission, validateBody(storeSchema), createStoreController)

// //patch para el actualizar una store
 router.patch(
   '/:id',
   authRequired,
   checkStorePermission,
   validateBody(updateStoreSchema),
   updateStoreController
 )

// //delete para Eliminar una store
// router.delete('/:id', authRequired, checkStorePermission, deleteStoreController)

// //get con id para obtener una store especifica
// router.get('/:id', authRequired, checkStorePermission, getStoreByIdController)
export default router
