import { z } from 'zod'

export const productSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(1, 'La descripcion es obligatoria.'),
  cantidad: z.number().int().nonnegative('La cantidad no puede ser negativa'),
  categoria: z.string().optional()
})

export const updateProductSchema = productSchema.partial()

export type ProductoInput = z.infer<typeof productSchema>
export type UpdateProductSchema = z.infer<typeof updateProductSchema>
