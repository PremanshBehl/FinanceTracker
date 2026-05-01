
import { useAuthStore } from '../store/authStore';
import { User as UserIcon, Mail, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const Profile = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account settings</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shadow-inner">
            <UserIcon className="w-12 h-12" />
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="text-sm font-medium text-slate-500">Full Name</label>
              <div className="mt-1 flex items-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                <UserIcon className="w-5 h-5 text-slate-400 mr-3" />
                <span className="font-medium text-slate-900">{user?.name}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-500">Email Address</label>
              <div className="mt-1 flex items-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                <Mail className="w-5 h-5 text-slate-400 mr-3" />
                <span className="font-medium text-slate-900">{user?.email}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-500">Account Security</label>
              <div className="mt-1 flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-emerald-500 mr-3" />
                  <span className="font-medium text-slate-900">Password is secure</span>
                </div>
                <button className="text-sm text-primary-600 font-medium hover:text-primary-700">Change</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button 
            onClick={logout}
            className="px-6 py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};
