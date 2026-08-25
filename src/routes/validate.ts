import { Router } from 'express'
import { validateBody, validateParams } from '../middleware/validateMiddleware'
import { authRequired } from '../middleware/authMiddleware'
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  refreshSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../schemas/authSchemas'
import * as AuthController from '../controllers/authControllers'

const router = Router()

router.post('/register', validateBody(registerSchema), AuthController.register)

router.post('/login', validateBody(loginSchema), AuthController.login)

router.post(
  '/change-password',
  authRequired,
  validateBody(changePasswordSchema),
  AuthController.changePassword
)

router.post('/refresh', validateBody(refreshSchema), AuthController.refresh)

router.get(
  '/verify-email',
  validateParams(verifyEmailSchema),
  AuthController.verifyEmail
)

router.post(
  '/resend-verification',
  validateBody(resendVerificationSchema),
  AuthController.resendVerification
)

router.post(
  '/forgot-password',
  validateBody(forgotPasswordSchema),
  AuthController.forgotPassword
)

router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  AuthController.resetPassword
)

export default router
