import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Video, 
  User, 
  Plus,
  Clock,
  CheckCircle,
  MoreHorizontal,
  ArrowRight,
  Info,
  Loader2,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { appointmentsAPI } from '../services/api';

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [pastConsultations, setPastConsultations] = useState([]);

  useEffect(() => {
    const fetchAppointmentsData = async () => {
      try {
        setLoading(true);
        // Fetch upcoming
        const upcomingRes = await appointmentsAPI.getAll({ status: 'upcoming', limit: 10 });
        setAppointments(upcomingRes.data.appointments.map(a => ({
          id: a._id,
          doctor: a.doctorId?.name || 'Assigned Physician',
          specialty: a.specialty,
          date: new Date(a.dateTime.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          time: new Date(a.dateTime.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          type: a.type,
          location: a.location?.address || a.location?.virtualLink || 'Main Clinic',
          hospital: 'HealRec Facility',
          status: a.status
        })));

        // Fetch past
        const pastRes = await appointmentsAPI.getAll({ status: 'past', limit: 10 });
        setPastConsultations(pastRes.data.appointments.map(a => ({
          id: a._id,
          doctor: a.doctorId?.name || 'Assigned Physician',
          specialty: a.specialty,
          date: new Date(a.dateTime.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          result: a.notes?.[0] || 'Check-up session',
          status: a.status
        })));

      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const nextApt = appointments[0];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments Hub</h1>
          <p className="text-slate-500 font-medium">Manage your clinical visits and telehealth consultations.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-premium flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>New Appointment</span>
        </motion.button>
      </header>

      {/* Hero Notice */}
      {nextApt && (
        <div className="p-6 bg-blue-600 rounded-3xl text-white flex items-center justify-between shadow-xl shadow-blue-500/20 overflow-hidden relative">
          <div className="relative z-10 flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                  <Info size={24} className="text-white" />
              </div>
              <div>
                  <h3 className="font-extrabold text-lg">Next Visit: {nextApt.doctor}</h3>
                  <p className="text-sm font-medium opacity-80">{nextApt.date} at {nextApt.time} • {nextApt.location}</p>
              </div>
          </div>
          <button className="relative z-10 px-6 py-2.5 bg-white text-blue-600 font-extrabold rounded-xl text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">Pre-Check</button>
          <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 translate-x-32"></div>
        </div>
      )}

      {/* Upcoming Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
                <Clock className="mr-3 text-blue-600" />
                Scheduled Visits
            </h2>
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Displaying {appointments.length} Items</div>
        </div>
        
        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {appointments.map((apt, idx) => (
              <motion.div 
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-0 flex flex-col group"
              >
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-blue-600 border border-white shadow-inner">
                        <User size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900">{apt.doctor}</h3>
                        <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mt-0.5">{apt.specialty} • {apt.hospital}</p>
                      </div>
                    </div>
                    <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 group-hover:text-slate-600 transition-all">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 group-hover:bg-white transition-colors">
                      <div className="flex items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter mb-2">
                          <Calendar size={12} className="mr-2" />
                          Date & Time
                      </div>
                      <p className="text-xs font-bold text-slate-800">{apt.date}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase">{apt.time}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 group-hover:bg-white transition-colors">
                      <div className="flex items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter mb-2">
                          {apt.type === 'Video' ? <Video size={12} className="mr-2 text-violet-500" /> : <MapPin size={12} className="mr-2 text-emerald-500" />}
                          {apt.type} Location
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">{apt.location}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{apt.status}</p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-5 bg-slate-50/50 border-t border-white/40 flex space-x-4">
                  <button className="flex-1 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-extrabold text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-blue-200 transition-all shadow-sm">Reschedule</button>
                  {apt.type === 'Video' ? (
                    <button className="flex-1 py-3 rounded-2xl bg-violet-600 text-white font-extrabold text-[10px] uppercase tracking-widest hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20">Join Call</button>
                  ) : (
                    <button className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Directions</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center text-slate-400 italic">
            No upcoming appointments scheduled.
          </div>
        )}
      </section>

      {/* History Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-slate-900">Consultation Journal</h2>
            <button className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center">
                Full History <ArrowRight size={14} className="ml-2" />
            </button>
        </div>
        <div className="glass-card overflow-hidden p-0 border-white/40">
          {pastConsultations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 border-b border-white/40">
                    <th className="px-8 py-5">Physician</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Clinical Summary</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {pastConsultations.map((past) => (
                    <tr key={past.id} className="hover:bg-white/40 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase border border-blue-100">
                                {past.doctor.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{past.doctor}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{past.specialty}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{past.date}</td>
                      <td className="px-8 py-6 text-sm font-extrabold text-slate-800">{past.result}</td>
                      <td className="px-8 py-6">
                        <span className={`flex items-center text-[10px] font-extrabold ${past.status === 'Completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-500 bg-slate-50 border-slate-100'} px-2.5 py-1 rounded-full border w-fit`}>
                          {past.status === 'Completed' && <CheckCircle size={12} className="mr-1.5" />}
                          {past.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all">
                            <FileText size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-10 text-center text-slate-400 italic">No past consultations recorded.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Appointments;
