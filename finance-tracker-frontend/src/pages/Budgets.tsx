import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { PieChart as PieChartIcon, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../lib/axios';

const budgetSchema = z.object({
  limitAmount: z.number().positive('Limit must be positive'),
  categoryId: z.string().uuid('Please select a category'),
});

type BudgetForm = z.infer<typeof budgetSchema>;

export const Budgets = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BudgetForm>({
    resolver: zodResolver(budgetSchema)
  });

  const fetchData = async () => {
    try {
      const [budgetsRes, categoriesRes] = await Promise.all([
        api.get(`/budgets?month=${currentMonth}&year=${currentYear}`),
        api.get('/categories')
      ]);
      setBudgets(budgetsRes.data.data.budgets);
      setCategories(categoriesRes.data.data.categories.filter((c: any) => c.type === 'EXPENSE'));
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: BudgetForm) => {
    try {
      setIsSubmitting(true);
      await api.post('/budgets', {
        ...data,
        month: currentMonth,
        year: currentYear
      });
      toast.success('Budget created');
      reset();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const formatCurrency = (val: number) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Budgets</h1>
          <p className="text-slate-500 mt-1">Track spending limits for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 glass-card p-6 h-fit"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-primary-500" />
            Set Budget
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expense Category</label>
              <select
                {...register('categoryId')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white transition-all"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Limit Amount ($)</label>
              <input
                {...register('limitAmount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="e.g. 500"
              />
              {errors.limitAmount && <p className="mt-1 text-xs text-red-600">{errors.limitAmount.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || categories.length === 0}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Create Budget'}
            </button>
            {categories.length === 0 && (
              <p className="text-xs text-slate-500 text-center">Please create an expense category first.</p>
            )}
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-4"
        >
          {budgets.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center">
              <PieChartIcon className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500">No active budgets for this month.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget, i) => {
                const limit = Number(budget.limitAmount);
                const spent = Number(budget.spentAmount);
                const percentage = Math.min(100, Math.round((spent / limit) * 100));
                const remaining = Math.max(0, limit - spent);
                const isOver = spent > limit;
                const isNear = percentage >= 85 && !isOver;

                return (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-5"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <h3 className="font-bold text-slate-900">{budget.category?.name}</h3>
                        {isOver ? (
                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Over Budget
                          </span>
                        ) : isNear ? (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                            Near Limit
                          </span>
                        ) : (
                          <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> On Track
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {percentage}%
                      </span>
                    </div>

                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden my-3">
                      <div 
                        className={`h-full transition-all duration-500 ${isOver ? 'bg-red-500' : isNear ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Spent: <span className="font-medium text-slate-900">{formatCurrency(spent)}</span>
                      </span>
                      <span className="text-slate-500">
                        {isOver ? 'Exceeded by: ' : 'Remaining: '}
                        <span className={`font-medium ${isOver ? 'text-red-600' : 'text-slate-900'}`}>
                          {formatCurrency(isOver ? spent - limit : remaining)}
                        </span>
                        <span className="text-slate-400 text-xs ml-1">of {formatCurrency(limit)}</span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
