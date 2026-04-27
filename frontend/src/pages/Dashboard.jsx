import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  PlusCircle,
  FileText,
  Calendar,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const stats = [
    { label: 'Active Reports', value: '12', icon: <FileText className="text-blue-600" />, trend: '+2 this month', color: 'blue' },
    { label: 'Upcoming Consults', value: '3', icon: <Calendar className="text-emerald-600" />, trend: 'Next: tomorrow', color: 'emerald' },
    { label: 'Medicines', value: '5', icon: <Zap className="text-violet-600" />, trend: '2 ending soon', color: 'violet' },
  ];

  const currentMedications = [
    { name: 'Amoxicillin', dose: '500mg', time: '2 times daily', progress: 70, status: 'Active' },
    { name: 'Lisinopril', dose: '10mg', time: 'Once daily (Morning)', progress: 40, status: 'Active' },
    { name: 'Vitamin D3', dose: '2000IU', time: 'Once daily', progress: 95, status: 'Active' },
  ];

  const { user } = useAuth();

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10 relative">
      <div className="mesh-gradient opacity-10 pointer-events-none fixed top-0 left-0 w-full h-full"></div>
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Greetings, <span className="text-gradient">{user?.name || 'User'}</span>
          </h1>
          <p className="text-slate-500 font-medium">Your medical profile is 90% complete. Continue for better insights.</p>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-premium flex items-center space-x-2"
        >
          <PlusCircle size={18} />
          <span>New Health Record</span>
        </motion.button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 border border-${stat.color}-100`}>
                {stat.icon}
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 bg-white/50 rounded-full border border-slate-100 shadow-sm">
                <TrendingUp size={10} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600">{stat.trend}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
            </div>
            {/* Subtle trend line mockup */}
            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full w-2/3 bg-gradient-to-r ${stat.color === 'blue' ? 'from-blue-400 to-blue-600' : stat.color === 'emerald' ? 'from-emerald-400 to-emerald-600' : 'from-violet-400 to-violet-600'}`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Medicine Progress */}
        <section className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
                <Clock className="mr-3 text-blue-600" />
                Vital Medication Course
              </h2>
              <p className="text-sm text-slate-400 font-medium">Tracking your current prescription cycles</p>
            </div>
            <button className="text-blue-600 text-xs font-extrabold flex items-center hover:underline group">
              MANAGE LOG <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="space-y-8">
            {currentMedications.map((med, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        {med.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">{med.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{med.dose} • {med.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-blue-600 px-2 py-1 bg-blue-50 rounded-lg">{med.progress}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-white/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${med.progress}%` }}
                    transition={{ duration: 1.5, delay: 0.5 + idx * 0.2, ease: "circOut" }}
                    className="h-full rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Health Status */}
        <div className="space-y-8">
            <section className="glass-card p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-xl shadow-blue-900/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-extrabold mb-2 text-white">Full Encryption</h3>
                    <p className="text-xs font-medium opacity-80 mb-6 text-white">Your medical data is protected with 256-bit AES encryption.</p>
                    <button className="w-full py-2.5 bg-white text-blue-700 rounded-xl text-xs font-extrabold hover:bg-blue-50 transition-colors uppercase tracking-wider">
                        View Security Report
                    </button>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </section>

            <section className="glass-card p-8">
                <h2 className="text-lg font-extrabold text-slate-900 mb-6">Recent Activity</h2>
                <div className="space-y-6">
                    <div className="flex space-x-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400">TODAY, 10:30 AM</p>
                            <h4 className="text-xs font-bold text-slate-800">Blood Test Result Received</h4>
                            <p className="text-[10px] text-slate-400">Apex Diagnostics Lab</p>
                        </div>
                    </div>
                    <div className="flex space-x-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400">YESTERDAY</p>
                            <h4 className="text-xs font-bold text-slate-800">New Appointment Booked</h4>
                            <p className="text-[10px] text-slate-400">Dr. Sarah Mitchell • Cardiology</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
