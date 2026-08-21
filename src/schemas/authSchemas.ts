import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, 'Old password must be at least 6 characters long'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters long')
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})
