import { z } from 'zod';

export const createBudgetSchema = z.object({
  body: z.object({
    limitAmount: z.number().positive('Limit must be positive'),
    month: z.number().min(1).max(12),
    year: z.number().min(2000),
    categoryId: z.string().uuid('Invalid category ID'),
  })
});
