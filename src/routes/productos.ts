import { Router } from 'express'
import {
  getAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
  getProductByIdController
} from '../controllers/productsControllers'
import { validateBody } from '../middleware/validateMiddleware'
import { productSchema, updateProductSchema } from '../schemas/productoSchema'
import { checkStorePermission } from '../middleware/roleMiddleware'
import { authRequired } from '../middleware/authMiddleware'

const router = Router()

//get para crear el producto
router.get('/', authRequired, checkStorePermission, getAllProductsController)

//post para crear el producto
router.post(
  '/',
  authRequired,
  checkStorePermission,
  validateBody(productSchema),
  createProductController
)

//patch para el actualizar el producto
router.patch('/:id', validateBody(updateProductSchema), updateProductController)

//delete para Eliminar el producto
router.delete('/:id', deleteProductController)

//get con id para obtener un producto solo
router.get('/:id', getProductByIdController)
export default router
