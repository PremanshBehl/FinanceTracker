import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../prisma/client.js';

export const getDashboardSummary = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const [totalIncomeResult, totalExpenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'INCOME' },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'EXPENSE' },
    }),
  ]);

  const totalIncome = Number(totalIncomeResult._sum.amount) || 0;
  const totalExpenses = Number(totalExpenseResult._sum.amount) || 0;
  const savings = totalIncome - totalExpenses;

  // Category-wise spending
  const categorySpendingData = await prisma.transaction.groupBy({
    by: ['categoryId'],
    _sum: { amount: true },
    where: { userId, type: 'EXPENSE', categoryId: { not: null } },
  });

  // Get category names
  const categoryIds = categorySpendingData.map(c => c.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });

  const categorySpending = categorySpendingData.map(c => {
    const category = categories.find(cat => cat.id === c.categoryId);
    return {
      categoryId: c.categoryId,
      categoryName: category ? category.name : 'Unknown',
      totalAmount: Number(c._sum.amount) || 0,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalIncome,
      totalExpenses,
      savings,
      categorySpending,
    },
  });
});
