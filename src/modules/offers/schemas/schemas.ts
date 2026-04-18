import { z } from 'zod';

export const offerSchema = z
  .object({
    name: z.string().optional(),
    offerPrice: z.number().min(0, 'El precio de oferta debe ser mayor o igual a 0'),
    offerStartsAt: z.string().optional(),
    offerEndsAt: z.string().min(1, 'La fecha de fin es obligatoria'),
    productIds: z.array(z.string()).min(1, 'Debes seleccionar al menos un producto'),
  })
  .superRefine((data, ctx) => {
    if (!data.offerEndsAt) {
      return;
    }

    const endsAt = new Date(data.offerEndsAt);
    if (Number.isNaN(endsAt.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['offerEndsAt'],
        message: 'La fecha de fin no es valida',
      });
      return;
    }

    if (!data.offerStartsAt) {
      return;
    }

    const startsAt = new Date(data.offerStartsAt);
    if (Number.isNaN(startsAt.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['offerStartsAt'],
        message: 'La fecha de inicio no es valida',
      });
      return;
    }

    if (startsAt >= endsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['offerEndsAt'],
        message: 'La fecha de fin debe ser mayor que la fecha de inicio',
      });
    }
  });

export type OfferForm = z.infer<typeof offerSchema>;
