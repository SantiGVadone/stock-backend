import { Router } from 'express'
import {
  getAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
  getProductByIdController
} from '../controllers/productsControllers'
import { validateBody } from '../middleware/validate'
import { productSchema, updateProductSchema } from '../schemas/productoSchema'

const router = Router()

//get para crear el producto
router.get('/', getAllProductsController)

//post para crear el producto
router.post('/', validateBody(productSchema), createProductController)

//patch para el actualizar el producto
router.patch('/:id', validateBody(updateProductSchema), updateProductController)

//delete para Eliminar el producto
router.delete('/:id', deleteProductController)

//get con id para obtener un producto solo
router.get('/:id', getProductByIdController)
export default router
