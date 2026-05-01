import express from 'express';
import { createBudget, getBudgets } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createBudgetSchema } from '../validations/budgetValidation.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(validate(createBudgetSchema), createBudget);

export default router;
