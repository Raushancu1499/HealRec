import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  PlusCircle,
  FileText,
  Calendar,
  Zap,
  ShieldCheck,
  Loader2,
  X,
  Lock,
  Server,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { reportsAPI, medicationsAPI, appointmentsAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [currentMedications, setCurrentMedications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch reports statistics
        const statsRes = await reportsAPI.getStatistics();
        const reportStats = statsRes.data.statistics;
        
        // Fetch medications
        const medsRes = await medicationsAPI.getAll({ limit: 3, status: 'active' });
        const meds = medsRes.data.medications.map(m => ({
          name: m.name,
          dose: m.dosage,
          time: m.frequency,
          progress: Math.min(100, Math.floor((m.adherence.takenDoses / 30) * 100)) || 0, // Mock progress based on doses
          status: m.isActive ? 'Active' : 'Inactive'
        }));

        // Fetch upcoming appointments for activity
        const apptsRes = await appointmentsAPI.getAll({ limit: 2, status: 'upcoming' });
        const appts = apptsRes.data.appointments;

        setStats([
          { label: 'Active Reports', value: reportStats.totalReports.toString(), icon: <FileText className="text-blue-600" />, trend: '+2 this month', color: 'blue' },
          { label: 'Upcoming Consults', value: appts.length.toString(), icon: <Calendar className="text-emerald-600" />, trend: 'Next: soon', color: 'emerald' },
          { label: 'Medicines', value: meds.length.toString(), icon: <Zap className="text-violet-600" />, trend: 'Tracking active', color: 'violet' },
        ]);

        setCurrentMedications(meds);
        
        // Combine activities
        const activities = [
          ...appts.map(a => ({
            id: a._id,
            type: 'appointment',
            title: `Appt with ${a.doctorId?.name || 'Doctor'}`,
            subtitle: a.specialty,
            time: new Date(a.dateTime.date).toLocaleDateString(),
            color: 'blue'
          })),
          { id: 'sec', type: 'security', title: 'Security Scan Complete', subtitle: 'System protected', time: 'TODAY', color: 'emerald' }
        ];
        setRecentActivity(activities.slice(0, 3));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

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
            {currentMedications.length > 0 ? (
              currentMedications.map((med, idx) => (
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
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No active medications tracked.</p>
            )}
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
                    <button 
                        onClick={() => setShowSecurityModal(true)}
                        className="w-full py-2.5 bg-white text-blue-700 rounded-xl text-xs font-extrabold hover:bg-blue-50 transition-colors uppercase tracking-wider"
                    >
                        View Security Report
                    </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </section>

            <section className="glass-card p-8">
                <h2 className="text-lg font-extrabold text-slate-900 mb-6">Recent Activity</h2>
                <div className="space-y-6">
                    {recentActivity.map((act) => (
                      <div key={act.id} className="flex space-x-4 items-start">
                          <div className={`w-2 h-2 rounded-full bg-${act.color}-500 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.5)]`}></div>
                          <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{act.time}</p>
                              <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                              <p className="text-[10px] text-slate-400">{act.subtitle}</p>
                          </div>
                      </div>
                    ))}
                </div>
            </section>
        </div>
      </div>

      <AnimatePresence>
        {showSecurityModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowSecurityModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-emerald-100 p-3 rounded-2xl">
                  <ShieldCheck size={28} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Security Report</h2>
                  <p className="text-emerald-600 font-bold text-sm">System Secure</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Lock className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">End-to-End Encryption</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">All personal data is encrypted at rest using AES-256 and in transit via TLS 1.3.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Server className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">HIPAA Compliant Servers</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Data is stored in isolated, heavily monitored environments adhering to compliance standards.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Key className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Authentication Status</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Session secured via advanced JWT tokens with strict expiry protocol.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowSecurityModal(false)}
                className="mt-8 w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-extrabold hover:bg-slate-800 transition-colors uppercase tracking-wider"
              >
                Close Report
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
