import { z } from 'zod';

const dateStringSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Invalid date format'
});

export const recordCreateSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  date: dateStringSchema.optional(),
  description: z.string().optional()
});

export const recordQuerySchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).optional(),
  search: z.string().min(1).optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10)
});