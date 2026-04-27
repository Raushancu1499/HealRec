import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Pill, 
  FlaskConical,
  Settings,
  Heart,
  LogOut,
  Users,
  ChevronRight,
  Activity,
  Smartphone,
  Video,
  AlertTriangle,
  Brain,
  Search,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allMenuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard', roles: ['Patient', 'Doctor', 'Lab', 'Admin'] },
    { name: 'Health Tracking', icon: <Activity size={18} />, path: '/health-tracking', roles: ['Patient', 'Doctor'] },
    { name: 'Medication Management', icon: <Pill size={18} />, path: '/medication-management', roles: ['Patient'] },
    { name: 'Telemedicine', icon: <Video size={18} />, path: '/telemedicine', roles: ['Patient', 'Doctor'] },
    { name: 'Medical Reports', icon: <FileText size={18} />, path: '/reports', roles: ['Patient', 'Admin'] },
    { name: 'Appointments', icon: <Calendar size={18} />, path: '/appointments', roles: ['Patient', 'Doctor'] },
    { name: 'Medicine Log', icon: <Pill size={18} />, path: '/medicine', roles: ['Patient'] },
    { name: 'Lab Portal', icon: <FlaskConical size={18} />, path: '/lab-portal', roles: ['Lab', 'Admin'] },
    { name: 'Find Doctor', icon: <Search size={18} />, path: '/find-doctor', roles: ['Patient'] },
    { name: 'Secure Messages', icon: <MessageCircle size={18} />, path: '/messages', roles: ['Patient', 'Doctor'] },
    { name: 'Health Insights', icon: <Brain size={18} />, path: '/health-insights', roles: ['Patient', 'Doctor'] },
    { name: 'Family Management', icon: <Users size={18} />, path: '/family-management', roles: ['Patient'] },
    { name: 'Emergency', icon: <AlertTriangle size={18} />, path: '/emergency', roles: ['Patient', 'Doctor'] },
    { name: 'User Management', icon: <Users size={18} />, path: '/users', roles: ['Admin'] },
  ];

  const filteredMenu = allMenuItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen sticky top-0 z-20 shadow-2xl">
      {/* Brand */}
      <div className="p-8 flex items-center space-x-3">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/30">
          <Heart className="text-white" size={24} fill="white" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">HealRec</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link group ${isActive ? 'active' : ''}`
            }
          >
            <div className="p-1 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <span className="flex-1">{item.name}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 mt-auto border-t border-slate-800/50 bg-slate-900/30">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all mb-4 text-sm font-bold group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout Session</span>
        </button>
        
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.name?.substring(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] uppercase font-extrabold text-blue-400/80 tracking-widest truncate">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
