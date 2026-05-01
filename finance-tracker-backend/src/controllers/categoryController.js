import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import prisma from '../prisma/client.js';

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, type } = req.body;

  const category = await prisma.category.create({
    data: {
      name,
      type,
      userId: req.user.id,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      category,
    },
  });
});

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await prisma.category.findMany({
    where: { userId: req.user.id },
  });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await prisma.category.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // Handle edge cases: "Cannot break transactions if category deleted"
  // The Prisma schema already handles this with onDelete: SetNull for transactions
  // And it deletes budgets with onDelete: Cascade
  
  await prisma.category.delete({
    where: { id },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
