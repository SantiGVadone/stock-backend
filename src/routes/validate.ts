import { Router } from 'express'
import { validateBody } from '../middleware/validateMiddleware'
import { registerSchema, loginSchema } from '../schemas/authSchemas'
import * as AuthController from '../controllers/authControllers'

const router = Router()

router.post('/register', validateBody(registerSchema), AuthController.register)

router.post('/login', validateBody(loginSchema), AuthController.login)

export default router
