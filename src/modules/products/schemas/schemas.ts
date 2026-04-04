import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  hasOffer: z.boolean(),
  offerPrice: z.number().min(0, "El precio en oferta debe ser mayor o igual a 0").optional(),
  offerDurationHours: z
    .number()
    .int("La duración debe ser un número entero")
    .min(1, "La duración debe ser al menos 1 hora")
    .optional(),
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
}).superRefine((data, ctx) => {
  if (!data.hasOffer) {
    return;
  }

  if (data.offerPrice === undefined || Number.isNaN(data.offerPrice)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["offerPrice"],
      message: "Debes definir un precio en oferta",
    });
  }

  if (data.offerDurationHours === undefined || Number.isNaN(data.offerDurationHours)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["offerDurationHours"],
      message: "Debes definir cuánto tiempo durará la oferta",
    });
  }

  if (
    data.offerPrice !== undefined &&
    !Number.isNaN(data.offerPrice) &&
    data.offerPrice >= data.price
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["offerPrice"],
      message: "El precio en oferta debe ser menor al precio base",
    });
  }
});


export type ProductForm = z.infer<typeof productSchema>;