import { Router } from 'express'
import * as ProductController from '../controllers/productsControllers'

const router = Router()

//get para crear el producto
router.get('/', ProductController.getProducts)

//post para crear el producto
router.post('/', ProductController.crearProduct)

export default router
