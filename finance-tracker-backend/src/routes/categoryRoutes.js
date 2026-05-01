import express from 'express';
import { createCategory, getCategories, deleteCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createCategorySchema } from '../validations/categoryValidation.js';

const router = express.Router();

router.use(protect); // All category routes are protected

router.route('/')
  .get(getCategories)
  .post(validate(createCategorySchema), createCategory);

router.route('/:id')
  .delete(deleteCategory);

export default router;
