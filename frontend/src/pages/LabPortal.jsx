import React, { useState } from 'react';
import { 
  Search, 
  FlaskConical, 
  UserCheck, 
  Upload, 
  FileUp, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Database,
  SearchCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LabPortal = () => {
  const [patientId, setPatientId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [patientFound, setPatientFound] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setPatientFound({
        id: patientId,
        name: 'John Smith',
        status: 'Verified',
        lastVisit: '2024-03-15',
        records: 4,
        email: 'john.smith@example.com'
      });
      setIsSearching(false);
    }, 1200);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <FlaskConical size={20} />
            </div>
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.2em]">Authorized Portal</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Advanced Lab Integration</h1>
          <p className="text-slate-500 font-medium max-w-2xl">Secure bridge for laboratories to directly synchronize diagnostic results with patient health records.</p>
        </motion.div>
        
        <div className="flex items-center space-x-2 px-4 py-2 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-900/10">
          <Database size={16} className="text-blue-400" />
          <div className="flex flex-col">
            <span className="text-[9px] font-extrabold uppercase tracking-widest opacity-60">Connected Node</span>
            <span className="text-[10px] font-bold">Apex Diagnostics • Node #42</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search Panel */}
        <section className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8 border-white/60 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center">
                <SearchCode className="mr-3 text-blue-600" />
                Patient Discovery
              </h2>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Patient ID or Verified Email</label>
                  <div className="flex items-center bg-white/60 px-4 py-3.5 rounded-2xl border border-white focus-within:bg-white focus-within:shadow-lg focus-within:border-blue-200 transition-all">
                    <Search size={18} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. HR-123456 or name@mail.com"
                      className="bg-transparent border-none outline-none px-4 w-full text-sm font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="w-full btn-premium py-4 flex items-center justify-center space-x-3 text-sm tracking-widest uppercase"
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Discovery in Progress...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck size={18} />
                      <span>Authenticate Patient</span>
                    </>
                  )}
                </button>
              </form>
            </div>
            {/* Background Accent */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
          </div>

          <div className="p-8 glass-card border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl">
                <div className="flex items-start space-x-4">
                    <div className="bg-white/10 p-3 rounded-2xl">
                        <ShieldCheck size={24} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-white mb-2">Protocol Compliance</h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">All uploads are automatically timestamped, digitally signed, and appended to the immutable patient blockchain.</p>
                        <div className="flex items-center text-[10px] font-bold text-emerald-400 tracking-widest">
                            <CheckCircle2 size={12} className="mr-2" />
                            NETWORK STATUS: OPERATIONAL
                        </div>
                    </div>
                </div>
          </div>
        </section>

        {/* Results & Upload Panel */}
        <section className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!patientFound ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 glass-card border-dashed border-2 border-slate-200/50 bg-slate-50/30 text-center"
              >
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 mb-6 group">
                   <div className="relative">
                      <Search size={64} className="text-slate-100 group-hover:scale-110 transition-transform" />
                      <CheckCircle2 size={24} className="absolute bottom-0 right-0 text-slate-200 group-hover:text-blue-300 transition-colors" />
                   </div>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">Awaiting Verification</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-sm">Enter a valid Patient ID to unlock the direct-upload integration layer.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Patient Profile Card */}
                <div className="glass-card p-10 relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative z-10">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-2xl shadow-blue-500/30 group-hover:rotate-3 transition-transform">
                        {patientFound.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{patientFound.name}</h3>
                            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-widest shadow-sm">Verified Profile</span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium mt-1">{patientFound.email}</p>
                        <div className="flex items-center mt-3 space-x-6">
                            <div className="flex items-center text-[10px] font-bold text-slate-500">
                                <Clock size={12} className="mr-1.5 opacity-50" />
                                LAST VISIT: {patientFound.lastVisit}
                            </div>
                            <div className="flex items-center text-[10px] font-bold text-slate-500">
                                <FileUp size={12} className="mr-1.5 opacity-50" />
                                {patientFound.records} TOTAL RECORDS
                            </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 py-2.5 glass-card border-none bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-widest transition-all">View Details</button>
                  </div>

                  {/* Upload Dropzone */}
                  <div className="p-12 border-2 border-dashed border-blue-200 rounded-3xl bg-blue-50/10 flex flex-col items-center justify-center text-center group/drop transition-all hover:bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 relative z-10">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover/drop:scale-110 group-hover/drop:bg-blue-600 group-hover/drop:text-white transition-all duration-300">
                        <Upload size={36} />
                    </div>
                    <h4 className="text-xl font-extrabold text-slate-800">Staging Area for Diagnostics</h4>
                    <p className="text-sm text-slate-400 mt-2 max-w-sm mb-8">Drag and drop verified PDF or Image reports here for instant synchronization.</p>
                    <button className="px-10 py-4 bg-white border border-blue-100 text-blue-600 font-extrabold rounded-2xl shadow-xl shadow-blue-500/5 hover:shadow-blue-500/15 hover:-translate-y-1 transition-all text-xs uppercase tracking-[0.2em]">Select Local File</button>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card p-6 flex items-center space-x-4 border-slate-100">
                        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600"><AlertCircle size={20} /></div>
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Awaiting Upload</p>
                            <p className="text-xs font-extrabold text-slate-800">Pending Blood Panel</p>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center space-x-4 border-emerald-100">
                        <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600"><CheckCircle2 size={20} /></div>
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">System Status</p>
                            <p className="text-xs font-extrabold text-slate-800">End-to-End Encrypted</p>
                        </div>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default LabPortal;
