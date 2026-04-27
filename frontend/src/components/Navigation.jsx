import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, UserCircle, Building2, ChevronDown } from 'lucide-react';
import RealTimeNotifications from './RealTimeNotifications';

const Navigation = () => {
  const { user } = useAuth();

  return (
    <>
      <nav className="p-4 px-8 glass-card border-none rounded-none sticky top-0 flex items-center justify-between z-10 mx-[-1.5rem] mt-[-1.5rem] mb-6">
        <div className="flex items-center space-x-6 flex-1">
          <div className="flex items-center w-full max-w-sm bg-slate-100/50 px-4 py-2.5 rounded-2xl border border-white/40 focus-within:bg-white focus-within:shadow-sm focus-within:border-blue-200 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documents or history..." 
              className="bg-transparent border-none outline-none px-3 w-full text-sm font-medium text-slate-600 placeholder:text-slate-400"
            />
          </div>
        
          {user?.institution && (
            <div className="hidden md:flex items-center space-x-2 bg-blue-600/10 px-4 py-2 rounded-xl">
              <Building2 size={18} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-800">{user.institution}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <Bell size={20} className="text-slate-600" />
            </button>
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              3
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <UserCircle size={20} className="text-slate-600" />
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-900">{user?.name}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter opacity-70">{user?.role}</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </nav>
      
      {/* Real-time Notifications */}
      <RealTimeNotifications />
    </>
  );
};

export default Navigation;
