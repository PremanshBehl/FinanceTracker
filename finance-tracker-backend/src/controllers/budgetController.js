import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import prisma from '../prisma/client.js';

export const createBudget = asyncHandler(async (req, res, next) => {
  const { limitAmount, month, year, categoryId } = req.body;

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: req.user.id },
  });

  if (!category || category.type !== 'EXPENSE') {
    return next(new AppError('Invalid category. Must be an expense category.', 400));
  }

  // Check if budget already exists for this category, month, year
  const existingBudget = await prisma.budget.findFirst({
    where: { categoryId, userId: req.user.id, month, year },
  });

  if (existingBudget) {
    return next(new AppError('Budget already exists for this category in this month/year', 400));
  }

  // Calculate already spent amount in that month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const transactions = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      categoryId,
      userId: req.user.id,
      date: { gte: startDate, lte: endDate },
    },
  });

  const spentAmount = transactions._sum.amount || 0;

  const budget = await prisma.budget.create({
    data: {
      limitAmount,
      spentAmount,
      month,
      year,
      categoryId,
      userId: req.user.id,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      budget,
    },
  });
});

export const getBudgets = asyncHandler(async (req, res, next) => {
  const { month, year } = req.query;

  const where = { userId: req.user.id };
  if (month) where.month = Number(month);
  if (year) where.year = Number(year);

  const budgets = await prisma.budget.findMany({
    where,
    include: { category: true },
  });

  res.status(200).json({
    status: 'success',
    results: budgets.length,
    data: {
      budgets,
    },
  });
});
