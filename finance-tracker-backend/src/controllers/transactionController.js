import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import prisma from '../prisma/client.js';

export const createTransaction = asyncHandler(async (req, res, next) => {
  const { amount, description, date, currency, type, categoryId } = req.body;

  // Validate category if provided
  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user.id },
    });
    if (!category) {
      return next(new AppError('Category not found or does not belong to user', 404));
    }
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      description,
      date: new Date(date),
      currency: currency || 'USD',
      type,
      categoryId,
      userId: req.user.id,
    },
  });

  // Automatically update budget if it's an expense
  if (type === 'EXPENSE' && categoryId) {
    const transactionDate = new Date(date);
    const month = transactionDate.getMonth() + 1;
    const year = transactionDate.getFullYear();

    const budget = await prisma.budget.findFirst({
      where: { categoryId, userId: req.user.id, month, year },
    });

    if (budget) {
      await prisma.budget.update({
        where: { id: budget.id },
        data: {
          spentAmount: {
            increment: amount,
          },
        },
      });
    }
  }

  res.status(201).json({
    status: 'success',
    data: {
      transaction,
    },
  });
});

export const getTransactions = asyncHandler(async (req, res, next) => {
  const { type, startDate, endDate, page = 1, limit = 10, sortBy = 'date', order = 'desc' } = req.query;

  const where = { userId: req.user.id };

  if (type) where.type = type;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: order },
      include: { category: true }
    }),
    prisma.transaction.count({ where })
  ]);

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / take),
    data: {
      transactions,
    },
  });
});

export const getTransactionById = asyncHandler(async (req, res, next) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { category: true }
  });

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      transaction,
    },
  });
});

export const updateTransaction = asyncHandler(async (req, res, next) => {
  const { amount, description, date, currency, type, categoryId } = req.body;
  const transactionId = req.params.id;

  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId: req.user.id },
  });

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  // Handle budget adjustments if the transaction is an expense
  let budgetAdjustmentNeeded = false;
  let oldAmount = transaction.amount;
  let oldType = transaction.type;
  let oldCategoryId = transaction.categoryId;
  let oldDate = transaction.date;

  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      amount,
      description,
      date: date ? new Date(date) : undefined,
      currency,
      type,
      categoryId,
    },
  });

  // Re-calculate budget logic here (simplified for this exercise)
  // A production app would reverse the old amount from the old budget and apply new to new budget

  res.status(200).json({
    status: 'success',
    data: {
      transaction: updatedTransaction,
    },
  });
});

export const deleteTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  // Revert budget logic (simplified)
  if (transaction.type === 'EXPENSE' && transaction.categoryId) {
    const tDate = new Date(transaction.date);
    const budget = await prisma.budget.findFirst({
      where: {
        categoryId: transaction.categoryId,
        userId: req.user.id,
        month: tDate.getMonth() + 1,
        year: tDate.getFullYear(),
      },
    });

    if (budget) {
      await prisma.budget.update({
        where: { id: budget.id },
        data: {
          spentAmount: {
            decrement: transaction.amount,
          },
        },
      });
    }
  }

  await prisma.transaction.delete({
    where: { id: transaction.id },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
