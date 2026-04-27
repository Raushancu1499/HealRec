import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Mail, 
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/users');
      if (res.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Administration</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage system access, roles, and user accounts.</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-premium flex items-center space-x-2">
            <UserPlus size={18} />
            <span>Register User</span>
          </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-sm focus-within:shadow-md transition-all">
          <div className="flex items-center flex-1 px-4">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="bg-transparent border-none outline-none px-4 py-2.5 w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white/40 p-1.5 rounded-2xl border border-white/60 flex items-center">
            <Filter size={16} className="text-slate-400 ml-3 mr-2" />
            <select 
              className="bg-transparent border-none outline-none pr-8 py-2.5 text-xs font-extrabold text-slate-600 uppercase tracking-widest cursor-pointer"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="Patient">Patients</option>
              <option value="Doctor">Doctors</option>
              <option value="Lab">Lab Staff</option>
              <option value="Admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden p-0 border-white/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 border-b border-white/40">
                <th className="px-8 py-5">User Profile</th>
                <th className="px-8 py-5">Role & Access</th>
                <th className="px-8 py-5">Registered Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              <AnimatePresence>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <motion.tr 
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/40 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                            user.role === 'Admin' ? 'bg-rose-500 shadow-rose-200' : 
                            user.role === 'Doctor' ? 'bg-blue-500 shadow-blue-200' : 
                            user.role === 'Lab' ? 'bg-amber-500 shadow-amber-200' : 'bg-emerald-500 shadow-emerald-200'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-sm">{user.name}</p>
                            <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                              <Mail size={10} className="mr-1.5" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`flex items-center w-fit px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${
                          user.role === 'Admin' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                          user.role === 'Doctor' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                          user.role === 'Lab' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          <Shield size={10} className="mr-1.5" />
                          {user.role}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center text-xs font-bold text-slate-600">
                          <Calendar size={14} className="mr-2 text-slate-300" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="flex items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 w-fit">
                          <CheckCircle size={12} className="mr-1.5" />
                          ACTIVE
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm">
                            <Trash2 size={16} />
                          </button>
                          <button className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Users size={40} className="text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No users found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: users.length.toString(), color: 'blue' },
          { label: 'Verified Doctors', value: users.filter(u => u.role === 'Doctor').length.toString(), color: 'indigo' },
          { label: 'Lab Partners', value: users.filter(u => u.role === 'Lab').length.toString(), color: 'amber' },
          { label: 'System Admins', value: users.filter(u => u.role === 'Admin').length.toString(), color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className={`glass-card p-6 border-${stat.color}-100 bg-${stat.color}-50/30`}>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-extrabold text-${stat.color}-600`}>{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
