import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  Search,
  Filter,
  Plus,
  MessageCircle,
  FileText,
  ShieldCheck,
  Mic,
  MicOff,
  VideoOff,
  Settings,
  Share,
  Download,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  User,
  Heart,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { telemedicineAPI, appointmentAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext';

const Telemedicine = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [isInCall, setIsInCall] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastConsultations, setPastConsultations] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([
    { id: 'all', name: 'All Specialties', icon: <Users size={16} /> }
  ]);

  const [callSettings, setCallSettings] = useState({
    videoEnabled: true,
    audioEnabled: true,
    screenShare: false
  });

  const [callQuality] = useState({
    connection: 'excellent',
    latency: '23ms',
    resolution: 'HD 720p'
  });

  useEffect(() => {
    fetchData();
  }, [selectedSpecialty, searchTerm, activeTab]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      if (activeTab === 'appointments') {
        const res = await appointmentAPI.getAppointments('upcoming');
        if (res.success) setUpcomingAppointments(res.data.appointments);
      } else if (activeTab === 'doctors') {
        const res = await telemedicineAPI.getDoctors(selectedSpecialty === 'all' ? '' : selectedSpecialty, searchTerm);
        if (res.success) setAvailableDoctors(res.data.doctors);
      } else if (activeTab === 'past') {
        const res = await telemedicineAPI.getConsultations('completed');
        if (res.success) setPastConsultations(res.data.consultations);
      }

      // Fetch specialties once
      if (specialties.length <= 1) {
        const specRes = await telemedicineAPI.getSpecialties();
        if (specRes.success) {
          const fetchedSpecs = specRes.data.specialties.map(s => ({
            id: s.id,
            name: s.name,
            icon: s.id === 'cardiology' ? <Heart size={16} /> : <User size={16} />
          }));
          setSpecialties([{ id: 'all', name: 'All Specialties', icon: <Users size={16} /> }, ...fetchedSpecs]);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching telemedicine data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = availableDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                           doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const startVideoCall = async (appointmentId) => {
    try {
      const res = await appointmentAPI.joinVideoCall(appointmentId);
      if (res.success) {
        setIsInCall(true);
      }
    } catch (err) {
      console.error('Error joining video call:', err);
      setError('Failed to join video call. Please try again.');
    }
  };

  const endCall = () => {
    setIsInCall(false);
  };

  const toggleSetting = (setting) => {
    setCallSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-emerald-600 bg-emerald-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Telemedicine</h1>
          <p className="text-slate-500 font-medium">Connect with healthcare providers from anywhere.</p>
        </motion.div>
        
        <div className="flex space-x-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2.5 glass-card rounded-xl text-xs font-extrabold flex items-center space-x-2 border-white/50"
          >
            <ShieldCheck size={16} />
            <span>Emergency Call</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-premium flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Book Appointment</span>
          </motion.button>
        </div>
      </header>

      {/* Video Call Interface */}
      <AnimatePresence>
        {isInCall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-slate-900 z-50 flex flex-col"
          >
            {/* Call Header */}
            <div className="flex items-center justify-between p-4 bg-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <h3 className="text-white font-bold">Dr. Sarah Mitchell</h3>
                  <p className="text-slate-400 text-sm">Cardiology • {callQuality.resolution}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">{callQuality.connection} connection</span>
                </div>
                <div className="text-slate-400 text-sm">
                  {callQuality.latency} latency
                </div>
                <button className="text-slate-400 hover:text-white">
                  <Settings size={20} />
                </button>
              </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative bg-slate-950">
              {/* Main Video */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <User size={48} className="text-slate-400" />
                  </div>
                  <p className="text-white text-lg">Dr. Sarah Mitchell</p>
                </div>
              </div>

              {/* Self Video */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-slate-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mb-2">
                    <User size={24} className="text-slate-400" />
                  </div>
                  <p className="text-white text-sm">You</p>
                </div>
              </div>

              {/* Call Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-4 p-4 bg-slate-800 rounded-full">
                  <button
                    onClick={() => toggleSetting('audioEnabled')}
                    className={`p-3 rounded-full transition-colors ${
                      callSettings.audioEnabled ? 'bg-slate-700 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {callSettings.audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  
                  <button
                    onClick={() => toggleSetting('videoEnabled')}
                    className={`p-3 rounded-full transition-colors ${
                      callSettings.videoEnabled ? 'bg-slate-700 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {callSettings.videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  
                  <button
                    onClick={() => toggleSetting('screenShare')}
                    className={`p-3 rounded-full transition-colors ${
                      callSettings.screenShare ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
                    }`}
                  >
                    <Share size={20} />
                  </button>
                  
                  <button
                    onClick={endCall}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <Phone size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-blue-600" size={20} />
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              This Week
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{upcomingAppointments.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Upcoming appointments</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Video className="text-emerald-600" size={20} />
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              Total
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{pastConsultations.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Past consultations</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-purple-600" size={20} />
            <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
              Available
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{availableDoctors.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Doctors online</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Star className="text-amber-600" size={20} />
            <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              Average
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">4.8</h3>
          <p className="text-xs text-slate-500 mt-1">Doctor rating</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
        {['appointments', 'doctors', 'past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-extrabold transition-all capitalize ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'appointments' ? 'Upcoming Appointments' :
             tab === 'doctors' ? 'Find Doctors' :
             'Past Consultations'}
          </button>
        ))}
      </div>

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {upcomingAppointments.map((appointment, idx) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">{appointment.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{appointment.doctor}</h3>
                    <p className="text-sm text-slate-600">{appointment.specialty}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Video size={12} />
                        <span>{appointment.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{appointment.duration}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startVideoCall(appointment.id)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-extrabold hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Video size={16} />
                    <span>Join Call</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Find Doctors Tab */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass-card rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              {specialties.map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => setSelectedSpecialty(specialty.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
                    selectedSpecialty === specialty.id
                      ? 'bg-blue-600 text-white'
                      : 'glass-card text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {specialty.icon}
                  <span>{specialty.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, idx) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{doctor.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{doctor.name}</h3>
                      <p className="text-sm text-slate-600">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="text-amber-400 fill-amber-400" size={14} />
                    <span className="text-sm font-bold text-slate-700">{doctor.rating}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Experience</span>
                    <span className="font-medium text-slate-700">{doctor.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Reviews</span>
                    <span className="font-medium text-slate-700">{doctor.reviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Next available</span>
                    <span className="font-medium text-blue-600">{doctor.nextAvailable}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Consultation</span>
                    <span className="font-bold text-slate-800">{doctor.consultationFee}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {doctor.specialties.map((spec, idx) => (
                      <span key={idx} className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      {doctor.acceptsInsurance && (
                        <div className="flex items-center space-x-1 text-emerald-600">
                          <CheckCircle2 size={12} />
                          <span>Insurance</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {doctor.languages.map((lang, idx) => (
                        <span key={idx} className="text-slate-500">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-extrabold hover:bg-blue-700"
                  >
                    Book Appointment
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2.5 glass-card rounded-lg text-sm font-extrabold text-slate-600 hover:text-slate-900"
                  >
                    View Profile
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Past Consultations Tab */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastConsultations.map((consultation, idx) => (
            <motion.div
              key={consultation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                    <div className="text-slate-600 font-bold text-lg">
                      {consultation.doctor.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{consultation.doctor}</h3>
                    <p className="text-sm text-slate-600">{consultation.specialty}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{consultation.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{consultation.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {consultation.type === 'video' ? <Video size={12} /> : <Phone size={12} />}
                        <span>{consultation.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{consultation.duration}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {consultation.recording && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 glass-card rounded-lg hover:bg-blue-50"
                      >
                        <Video size={16} className="text-blue-600" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 glass-card rounded-lg hover:bg-blue-50"
                    >
                      <FileText size={16} className="text-blue-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 glass-card rounded-lg hover:bg-blue-50"
                    >
                      <MessageCircle size={16} className="text-blue-600" />
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Consultation Details */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
                  <p className="text-slate-700">{consultation.diagnosis}</p>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Prescription</p>
                  <p className="text-slate-700">{consultation.prescription}</p>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Follow-up</p>
                  <p className="text-slate-700">{consultation.followUp}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Telemedicine;
