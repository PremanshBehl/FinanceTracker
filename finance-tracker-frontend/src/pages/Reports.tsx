
import { Download, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Reports = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
        <p className="text-slate-500 mt-1">Generate and download your financial analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 border-l-4 border-l-primary-500"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-500" />
                Monthly Summary
              </h3>
              <p className="text-sm text-slate-500 mt-1">Complete overview of income, expenses, and budgets for the current month.</p>
            </div>
            <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 border-l-4 border-l-rose-500"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2 text-rose-500" />
                Expense Analytics
              </h3>
              <p className="text-sm text-slate-500 mt-1">Detailed breakdown of where your money went, grouped by category.</p>
            </div>
            <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 border-l-4 border-l-emerald-500"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
                Income Analytics
              </h3>
              <p className="text-sm text-slate-500 mt-1">Detailed tracking of your cash flow and income sources.</p>
            </div>
            <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
