import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(2, 'Description is required'),
    date: z.string().datetime({ message: 'Invalid datetime string' }),
    currency: z.string().length(3).optional(),
    type: z.enum(['INCOME', 'EXPENSE']),
    categoryId: z.string().uuid('Invalid category ID').optional(),
  })
});

export const updateTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive').optional(),
    description: z.string().min(2, 'Description is required').optional(),
    date: z.string().datetime({ message: 'Invalid datetime string' }).optional(),
    currency: z.string().length(3).optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
  })
});

export const getTransactionsSchema = z.object({
  query: z.object({
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortBy: z.enum(['date', 'amount', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
  })
});
