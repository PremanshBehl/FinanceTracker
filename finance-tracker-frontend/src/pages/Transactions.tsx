import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Search, X, Filter } from 'lucide-react';
import api from '../lib/axios';
import clsx from 'clsx';

const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(2, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

export const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'EXPENSE', date: new Date().toISOString().split('T')[0] }
  });

  const selectedType = watch('type');
  const filteredCategories = categories.filter(c => c.type === selectedType);

  const fetchData = async () => {
    try {
      const [transRes, catRes] = await Promise.all([
        api.get('/transactions', { params: { type: typeFilter || undefined, limit: 50 } }),
        api.get('/categories')
      ]);
      setTransactions(transRes.data.data.transactions);
      setCategories(catRes.data.data.categories);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [typeFilter]);

  const onSubmit = async (data: TransactionForm) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
        categoryId: data.categoryId || undefined
      };
      await api.post('/transactions', payload);
      toast.success('Transaction added');
      setIsModalOpen(false);
      reset();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val: number) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 mt-1">View and manage your recent activity</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Transaction
        </button>
      </div>

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div className="flex items-center w-full sm:w-auto gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-auto"
          >
            <option value="">All Types</option>
            <option value="EXPENSE">Expenses Only</option>
            <option value="INCOME">Income Only</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">Transaction</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((t, i) => (
                  <motion.tr 
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm",
                          t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        )}>
                          {t.type === 'INCOME' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <span className="font-medium text-slate-900">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {t.category ? (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                          {t.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-sm">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {format(new Date(t.date), 'MMM dd, yyyy')}
                    </td>
                    <td className={clsx(
                      "px-6 py-4 text-right font-bold",
                      t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'
                    )}>
                      {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">New Transaction</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => reset({ ...watch(), type: 'EXPENSE' })}
                    className={clsx(
                      "py-2.5 rounded-xl text-sm font-medium transition-all flex justify-center items-center",
                      selectedType === 'EXPENSE' ? 'bg-rose-100 text-rose-700 border-2 border-rose-200' : 'bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100'
                    )}
                  >
                    <ArrowDownRight className="w-4 h-4 mr-1" /> Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => reset({ ...watch(), type: 'INCOME' })}
                    className={clsx(
                      "py-2.5 rounded-xl text-sm font-medium transition-all flex justify-center items-center",
                      selectedType === 'INCOME' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100'
                    )}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-1" /> Income
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                  <input
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    {...register('description')}
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="What was this for?"
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                      {...register('categoryId')}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">None</option>
                      {filteredCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input
                      {...register('date')}
                      type="date"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-sm disabled:opacity-70 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Save Transaction'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
