import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(1, 'La descripcion es obligatoria.'),
  quantity: z.number().int().nonnegative('La cantidad no puede ser negativa'),
  category: z.string().optional()
})

export const updateProductSchema = productSchema.partial()
