import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  FileText, 
  Download, 
  Eye,
  MoreVertical,
  FlaskConical,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reportAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [searchTerm]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await reportAPI.getReports(1, 10, 'all', searchTerm);
      if (response.success) {
        setReports(response.data.reports);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medical Records</h1>
          <p className="text-slate-500 font-medium">Your complete medical history, digitized and encrypted.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 glass-card rounded-xl text-xs font-extrabold flex items-center space-x-2 border-white/50 hover:bg-white transition-all uppercase tracking-wider">
            <Filter size={16} className="text-slate-400" />
            <span>Filter List</span>
          </button>
          <button className="btn-premium flex items-center space-x-2">
            <Upload size={18} />
            <span>Upload Document</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex items-center w-full bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-sm focus-within:shadow-md transition-all">
        <div className="flex items-center flex-1 px-4">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by diagnosis, lab name or date..."
            className="bg-transparent border-none outline-none px-4 py-3 w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {reports.map((report, idx) => (
            <motion.div 
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card p-0 group overflow-hidden"
            >
              <div className="p-6 flex items-start justify-between">
                <div className="flex items-center space-x-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${report.type.includes('Lab') ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-violet-50 text-violet-600 border border-violet-100'}`}>
                    {report.type.includes('Lab') ? <FlaskConical size={24} /> : <FileText size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{report.name}</h3>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="flex items-center mt-1 space-x-3">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{report.type}</span>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{report.date}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-xl border border-transparent hover:border-slate-100 hover:bg-white text-slate-400 transition-all">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="px-6 py-4 bg-slate-50/50 border-t border-white/40 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {report.status === 'Verified' ? (
                        <div className="flex items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm">
                            <ShieldCheck size={12} className="mr-1.5" />
                            OFFICIALLY VERIFIED
                        </div>
                    ) : (
                        <div className="flex items-center text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 italic">
                            PENDING VERIFICATION
                        </div>
                    )}
                    <span className="text-[10px] font-bold text-slate-300">{report.size}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                    <button className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                        <Eye size={16} />
                    </button>
                    <button className="px-4 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center space-x-2 text-[10px] font-extrabold text-slate-900 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider">
                        <Download size={14} />
                        <span>Download</span>
                    </button>
                </div>
              </div>
              
              {/* Premium Progress Bar (Mocked for data entry) */}
              <div className="h-1 w-full bg-slate-100">
                <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20"></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lab Partner Highlight */}
      <section className="glass-card p-10 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-[0.2em] mb-4 block">Ecosystem Integration</span>
                <h2 className="text-4xl font-extrabold mb-4 leading-tight">Partner Laboratory Network</h2>
                <p className="text-slate-400 font-medium mb-8 leading-relaxed">Connect your account to any of our 500+ partner laboratories for instantaneous, encrypted report delivery directly to your dashboard.</p>
                <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-3 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 uppercase text-xs tracking-widest">Connect Lab</button>
                    <button className="px-8 py-3 bg-white/10 text-white font-extrabold rounded-2xl border border-white/10 hover:bg-white/20 transition-all uppercase text-xs tracking-widest">Partner Directory</button>
                </div>
            </div>
            <div className="relative hidden md:block">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
                <FlaskConical size={200} className="mx-auto text-blue-500/20 rotate-12" />
            </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
