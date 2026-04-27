import React from 'react';
import { 
  Pill, 
  Calendar, 
  AlertCircle, 
  Plus, 
  Trash2,
  Clock,
  History,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const MedicineHistory = () => {
  const currentMeds = [
    { id: 1, name: 'Amoxicillin', type: 'Antibiotic', dosage: '500mg', frequency: '2x per day', started: '2024-04-10', duration: '14 days', instructions: 'Take after meals', progress: 70 },
    { id: 2, name: 'Atorvastatin', type: 'Cholesterol', dosage: '20mg', frequency: '1x per day', started: '2024-01-05', duration: 'Ongoing', instructions: 'Before bedtime', progress: 100 },
  ];

  const pastMeds = [
    { id: 101, name: 'Ibuprofen', dosage: '400mg', date: 'Feb 2024', reason: 'Fever', course: '3 days' },
    { id: 102, name: 'Paracetamol', dosage: '500mg', date: 'Dec 2023', reason: 'Headache', course: '2 days' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 relative">
      <div className="mesh-gradient opacity-10 pointer-events-none fixed top-0 left-0 w-full h-full"></div>
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medicine Repository</h1>
          <p className="text-slate-500 font-medium tracking-tight">Prescription tracking and medication consumption history.</p>
        </motion.div>
        <button className="btn-premium flex items-center space-x-2">
          <Plus size={18} />
          <span>Add New Entry</span>
        </button>
      </header>

      {/* Overview Analytics (Mocked) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-blue-100 bg-blue-50/30">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">Active Courses</p>
                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><Pill size={16} /></div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900">02</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Updates 2h ago</p>
        </div>
        <div className="glass-card p-6 border-emerald-100 bg-emerald-50/30">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">Adherence Rate</p>
                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"><TrendingUp size={16} /></div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900">98%</h3>
            <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">Excellent Status</p>
        </div>
        <div className="glass-card p-6 border-amber-100 bg-amber-50/30">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">Refills Needed</p>
                <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600"><AlertCircle size={16} /></div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900">01</h3>
            <p className="text-[10px] font-bold text-amber-600 mt-1 uppercase">Amoxicillin (4d left)</p>
        </div>
      </div>

      {/* Active Medications */}
      <section>
        <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center">
          <Clock className="mr-3 text-blue-600" size={20} />
          Current Clinical Course
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {currentMeds.map((med, idx) => (
            <motion.div 
              key={med.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-0 overflow-hidden relative group border-white/60"
            >
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                      <Pill size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800">{med.name}</h3>
                      <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-[0.2em]">{med.type}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2.5 glass-card border-none hover:bg-white text-slate-400 rounded-xl transition-all"><Settings size={18} /></button>
                    <button className="p-2.5 glass-card border-none hover:bg-red-50 text-red-400 rounded-xl transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: 'Dosage', value: med.dosage },
                    { label: 'Frequency', value: med.frequency },
                    { label: 'Started', value: med.started },
                    { label: 'Duration', value: med.duration }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/40 p-4 rounded-2xl border border-white/60 group-hover:border-blue-100 transition-colors">
                      <p className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider mb-1">{item.label}</p>
                      <p className="text-xs font-extrabold text-slate-800">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Course Progress</span>
                        <span className="text-xs font-extrabold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-lg border border-blue-100">{med.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 p-0.5 rounded-full overflow-hidden border border-white shadow-inner">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${med.progress}%` }}
                            transition={{ duration: 1.2, delay: 0.8, ease: "anticipate" }}
                            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.3)]"
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 p-4 bg-emerald-50 rounded-2xl flex items-center space-x-4 border border-emerald-100">
                    <div className="bg-emerald-500 p-1.5 rounded-lg text-white shadow-lg shadow-emerald-500/20">
                      <ShieldCheck size={14} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-emerald-800 leading-tight">Patient Instructions</p>
                      <p className="text-[10px] text-emerald-600 font-medium">{med.instructions}</p>
                    </div>
                  </div>
                  
                  {med.progress > 60 && (
                    <button className="flex items-center justify-center space-x-2 px-6 py-4 bg-slate-900 text-white font-extrabold rounded-2xl hover:bg-slate-800 transition-all shadow-lg text-[10px] uppercase tracking-widest">
                      <ShoppingCart size={14} />
                      <span>Order Refill Delivery</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Card Accent */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <Pill size={120} className="rotate-12" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brief History Timeline */}
      <section>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
                <History className="mr-3 text-slate-400" size={20} />
                Historical Archive
            </h2>
            <button className="text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.2em] flex items-center hover:underline">
                EXPORT ARCHIVE <ChevronRight size={14} className="ml-1" />
            </button>
        </div>
        <div className="glass-card p-0 overflow-hidden border-white/40 shadow-xl">
          <div className="p-10 space-y-8 relative before:absolute before:left-[147.5px] before:top-10 before:h-[calc(100%-80px)] before:w-px before:bg-slate-200 hidden md:block">
            {pastMeds.map((past, idx) => (
              <div key={past.id} className="flex items-center group">
                <div className="w-32 text-right">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{past.date}</span>
                </div>
                <div className="mx-10 relative">
                  <div className="w-4 h-4 rounded-full bg-slate-200 border-4 border-white z-10 relative group-hover:bg-blue-500 group-hover:scale-125 transition-all shadow-sm"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-full transition-all"></div>
                </div>
                <div className="flex-1 bg-white/40 p-5 rounded-2xl border border-white/60 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-extrabold text-slate-800">{past.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{past.dosage} course for {past.reason}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">Course End</span>
                            <span className="text-[10px] font-bold text-slate-800">{past.course}</span>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
          {/* Mobile version simple list */}
          <div className="md:hidden p-8 space-y-6">
             {pastMeds.map(past => (
               <div key={past.id} className="p-4 bg-white/40 rounded-xl border border-white/40">
                  <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">{past.date}</p>
                  <h4 className="font-bold text-slate-800">{past.name}</h4>
                  <p className="text-xs text-slate-500">{past.reason} • {past.dosage}</p>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicineHistory;
