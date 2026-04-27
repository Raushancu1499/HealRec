import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Filter,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FindDoctor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState('All');

  const specialties = ['All', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics'];

  const doctors = [
    { id: 1, name: 'Dr. Sarah Mitchell', specialty: 'Cardiology', rating: 4.9, reviews: 128, location: 'City General Hospital', nextAvailable: 'Today, 2:00 PM', fee: '$150', image: 'SM', verified: true, type: ['In-person', 'Video'] },
    { id: 2, name: 'Dr. Rahul Sharma', specialty: 'Dermatology', rating: 4.8, reviews: 95, location: 'Skin Care Clinic', nextAvailable: 'Tomorrow, 10:30 AM', fee: '$120', image: 'RS', verified: true, type: ['Video'] },
    { id: 3, name: 'Dr. Emily Chen', specialty: 'Pediatrics', rating: 5.0, reviews: 210, location: 'Childrens Health Center', nextAvailable: 'Today, 4:15 PM', fee: '$130', image: 'EC', verified: true, type: ['In-person'] },
    { id: 4, name: 'Dr. Michael Barnes', specialty: 'Orthopedics', rating: 4.7, reviews: 84, location: 'Sports Medicine Inst.', nextAvailable: 'Apr 26, 9:00 AM', fee: '$200', image: 'MB', verified: false, type: ['In-person', 'Video'] },
  ];

  const filteredDoctors = doctors.filter(doc => 
    (activeSpecialty === 'All' || doc.specialty === activeSpecialty) &&
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find & Book Top Doctors</h1>
          <p className="text-slate-500 font-medium tracking-tight">Book verified specialists for in-person or telehealth consultations.</p>
        </motion.div>
      </header>

      {/* Advanced Search & Filter */}
      <section className="glass-card p-6 border-white/60 shadow-xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center bg-white/60 px-4 py-3 rounded-2xl border border-white focus-within:bg-white focus-within:shadow-lg focus-within:border-blue-200 transition-all">
            <Search size={20} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by doctor name, specialty, or condition..."
              className="bg-transparent border-none outline-none px-4 w-full text-sm font-bold text-slate-700 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-white/60 px-4 py-3 rounded-2xl border border-white focus-within:bg-white transition-all w-full md:w-64">
             <MapPin size={20} className="text-slate-400" />
             <input type="text" placeholder="Location" className="bg-transparent border-none outline-none px-4 w-full text-sm font-bold text-slate-700" defaultValue="Current Location" />
          </div>
          <button className="px-6 py-3 bg-slate-900 text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors shadow-lg">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
        
        {/* Specialty Pills */}
        <div className="relative z-10 mt-6 flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
            {specialties.map(spec => (
                <button 
                  key={spec}
                  onClick={() => setActiveSpecialty(spec)}
                  className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all ${
                      activeSpecialty === spec 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                      : 'bg-white/50 text-slate-500 hover:bg-white border border-white/60'
                  }`}
                >
                    {spec}
                </button>
            ))}
        </div>
        
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      </section>

      {/* Results Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
                {filteredDoctors.length} Specialists Available
            </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
                {filteredDoctors.map((doc, idx) => (
                    <motion.div 
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-card p-0 overflow-hidden border-white/60 group hover:border-blue-200 transition-colors"
                    >
                        <div className="p-6 flex flex-col sm:flex-row gap-6">
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-2xl font-extrabold shadow-inner border-2 border-white relative">
                                    {doc.image}
                                    {doc.verified && (
                                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5">
                                            <CheckCircle className="text-emerald-500" size={24} fill="white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-[10px] font-extrabold ml-1">{doc.rating}</span>
                                    <span className="text-[9px] font-bold text-amber-600/60 ml-1">({doc.reviews})</span>
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{doc.name}</h3>
                                        <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest">{doc.specialty}</p>
                                    </div>
                                    <span className="text-sm font-extrabold text-slate-900">{doc.fee}</span>
                                </div>
                                
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-xs font-bold text-slate-500">
                                        <MapPin size={14} className="mr-2 text-slate-400" />
                                        {doc.location}
                                    </div>
                                    <div className="flex items-center text-xs font-bold text-slate-500">
                                        <Clock size={14} className="mr-2 text-emerald-500" />
                                        <span className="text-emerald-600">Next Available: {doc.nextAvailable}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex gap-2">
                                    {doc.type.map(t => (
                                        <span key={t} className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded-md flex items-center">
                                            {t === 'Video' && <Video size={10} className="mr-1 text-violet-500" />}
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-white/40 border-t border-white/60 flex items-center justify-between">
                            <button className="text-xs font-extrabold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center">
                                View Profile
                            </button>
                            <button className="btn-premium px-8 py-2 text-xs uppercase tracking-widest rounded-xl">
                                Book Consult
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default FindDoctor;
