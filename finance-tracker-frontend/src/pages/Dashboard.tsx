import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../lib/axios';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const formatCurrency = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const stats = [
    { name: 'Total Balance', value: data?.savings, icon: Wallet, color: 'text-primary-600', bg: 'bg-primary-100' },
    { name: 'Total Income', value: data?.totalIncome, icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Total Expenses', value: data?.totalExpenses, icon: ArrowDownRight, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} mr-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(stat.value || 0)}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 min-h-[400px] flex flex-col"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Expense Breakdown</h3>
          <div className="flex-1 w-full min-h-[300px]">
            {data?.categorySpending?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="totalAmount"
                    nameKey="categoryName"
                  >
                    {data.categorySpending.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <PieChart className="w-16 h-16 mb-2 opacity-50" />
                <p>No expense data available</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 min-h-[400px] flex flex-col"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Spend (Categories)</h3>
          <div className="flex-1 w-full min-h-[300px]">
            {data?.categorySpending?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categorySpending}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="categoryName" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="totalAmount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <BarChart className="w-16 h-16 mb-2 opacity-50" />
                <p>No expense data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
