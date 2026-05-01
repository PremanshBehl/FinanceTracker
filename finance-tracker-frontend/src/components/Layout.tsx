
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Receipt, Tags, PieChart, LogOut, User as UserIcon, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const Layout = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Categories', href: '/categories', icon: Tags },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mr-3 shadow-md shadow-primary-500/20">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">FinTrack</h1>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'text-primary-700 bg-primary-50 font-medium' 
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:hidden">
           <h1 className="text-lg font-bold text-primary-600">FinTrack</h1>
           <button onClick={logout} className="p-2 text-slate-600"><LogOut className="w-5 h-5" /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
