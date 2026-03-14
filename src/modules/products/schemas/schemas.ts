import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock debe ser mayor o igual a 0"),
  category: z
    .object({
      id: z.string(),
      label: z.string(),
    })
    .partial()
    .optional(),
});


export type ProductForm = z.infer<typeof productSchema>;