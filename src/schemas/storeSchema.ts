import { z } from 'zod'

export const storeSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  location: z.string().optional(),
  phone: z.string().optional()
})

export const updateStoreSchema = storeSchema.partial()
