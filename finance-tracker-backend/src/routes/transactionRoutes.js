import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createTransactionSchema, updateTransactionSchema, getTransactionsSchema } from '../validations/transactionValidation.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(validate(getTransactionsSchema), getTransactions)
  .post(validate(createTransactionSchema), createTransaction);

router.route('/:id')
  .get(getTransactionById)
  .patch(validate(updateTransactionSchema), updateTransaction)
  .delete(deleteTransaction);

export default router;
