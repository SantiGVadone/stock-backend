import { Router } from 'express'
import { validateBody } from '../middleware/validateMiddleware'
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  refreshSchema
} from '../schemas/authSchemas'
import * as AuthController from '../controllers/authControllers'

const router = Router()

router.post('/register', validateBody(registerSchema), AuthController.register)

router.post('/login', validateBody(loginSchema), AuthController.login)

router.post(
  '/change-password',
  validateBody(changePasswordSchema),
  AuthController.changePassword
)

router.post('/refresh', validateBody(refreshSchema), AuthController.refresh)

export default router
