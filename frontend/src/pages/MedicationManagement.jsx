import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Clock, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Plus,
  Search,
  Filter,
  Camera,
  Scan,
  Phone,
  MapPin,
  ChevronRight,
  TrendingUp,
  Users,
  ShieldCheck,
  Info,
  Zap,
  Package,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MedicationManagement = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [medications] = useState({
    current: [
      {
        id: 1,
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: '2x daily',
        time: ['08:00', '20:00'],
        nextDose: '2024-04-21T20:00:00',
        remaining: 8,
        total: 14,
        prescribedBy: 'Dr. Sarah Mitchell',
        startDate: '2024-04-10',
        endDate: '2024-04-24',
        instructions: 'Take with food',
        refills: 2,
        pharmacy: 'CVS Pharmacy',
        color: 'blue',
        adherence: 85
      },
      {
        id: 2,
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: '1x daily',
        time: ['09:00'],
        nextDose: '2024-04-22T09:00:00',
        remaining: 25,
        total: 30,
        prescribedBy: 'Dr. Johnathan Doe',
        startDate: '2024-01-05',
        endDate: 'Ongoing',
        instructions: 'Take before breakfast',
        refills: 3,
        pharmacy: 'Walgreens',
        color: 'red',
        adherence: 92
      },
      {
        id: 3,
        name: 'Vitamin D3',
        dosage: '2000IU',
        frequency: '1x daily',
        time: ['12:00'],
        nextDose: '2024-04-21T12:00:00',
        remaining: 45,
        total: 60,
        prescribedBy: 'OTC',
        startDate: '2024-03-15',
        endDate: 'Ongoing',
        instructions: 'Take with lunch',
        refills: 0,
        pharmacy: 'Any',
        color: 'yellow',
        adherence: 78
      }
    ],
    past: [
      {
        id: 101,
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: '3x daily',
        duration: '5 days',
        completedDate: '2024-02-15',
        reason: 'Fever',
        adherence: 100
      },
      {
        id: 102,
        name: 'Azithromycin',
        dosage: '250mg',
        frequency: '1x daily',
        duration: '5 days',
        completedDate: '2024-01-20',
        reason: 'Infection',
        adherence: 90
      }
    ]
  });

  const [upcomingReminders] = useState([
    { id: 1, medication: 'Amoxicillin', time: '20:00', dose: '500mg', type: 'tonight' },
    { id: 2, medication: 'Lisinopril', time: '09:00', dose: '10mg', type: 'tomorrow' },
    { id: 3, medication: 'Vitamin D3', time: '12:00', dose: '2000IU', type: 'today' }
  ]);

  const [drugInteractions] = useState([
    {
      id: 1,
      severity: 'moderate',
      medication1: 'Lisinopril',
      medication2: 'Ibuprofen',
      effect: 'May reduce blood pressure effectiveness',
      recommendation: 'Monitor blood pressure closely'
    }
  ]);

  const [pharmacies] = useState([
    {
      id: 1,
      name: 'CVS Pharmacy',
      address: '123 Main St, City, State 12345',
      phone: '(555) 123-4567',
      distance: '0.5 miles',
      hours: '8:00 AM - 10:00 PM',
      rating: 4.5,
      services: ['24hr', 'Drive-thru', 'Refill']
    },
    {
      id: 2,
      name: 'Walgreens',
      address: '456 Oak Ave, City, State 12345',
      phone: '(555) 987-6543',
      distance: '1.2 miles',
      hours: '7:00 AM - 11:00 PM',
      rating: 4.3,
      services: ['24hr', 'Drive-thru', 'Refill']
    }
  ]);

  const [adherenceStats] = useState({
    weekly: 85,
    monthly: 88,
    missedDoses: 3,
    takenOnTime: 92
  });

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMedicationColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  const getNextDoseStatus = (nextDose) => {
    const now = new Date();
    const doseTime = new Date(nextDose);
    const diffMs = doseTime - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 0) return { status: 'overdue', color: 'red' };
    if (diffHours < 2) return { status: 'soon', color: 'amber' };
    if (diffHours < 24) return { status: 'today', color: 'blue' };
    return { status: 'future', color: 'green' };
  };

  const filteredMedications = medications[activeTab].filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medication Management</h1>
          <p className="text-slate-500 font-medium">Smart reminders, refills, and drug interaction tracking.</p>
        </motion.div>
        
        <div className="flex space-x-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2.5 glass-card rounded-xl text-xs font-extrabold flex items-center space-x-2 border-white/50"
            onClick={() => setShowAddMedication(true)}
          >
            <Camera size={16} />
            <span>Scan Prescription</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-premium flex items-center space-x-2"
            onClick={() => setShowAddMedication(true)}
          >
            <Plus size={18} />
            <span>Add Medication</span>
          </motion.button>
        </div>
      </header>

      {/* Drug Interactions Alert */}
      {drugInteractions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="text-amber-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-800">Drug Interaction Alert</h3>
              <div className="mt-2 space-y-2">
                {drugInteractions.map(interaction => (
                  <div key={interaction.id} className="text-sm">
                    <span className="font-medium text-amber-700">
                      {interaction.medication1} + {interaction.medication2}
                    </span>
                    <p className="text-amber-600 text-xs mt-1">{interaction.effect}</p>
                    <p className="text-amber-500 text-xs mt-1">{interaction.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Pill className="text-blue-600" size={20} />
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{medications.current.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Current medications</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-emerald-600" size={20} />
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              Today
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{upcomingReminders.filter(r => r.type === 'today').length}</h3>
          <p className="text-xs text-slate-500 mt-1">Doses remaining</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-purple-600" size={20} />
            <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
              Adherence
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{adherenceStats.weekly}%</h3>
          <p className="text-xs text-slate-500 mt-1">This week</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <RefreshCw className="text-amber-600" size={20} />
            <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              Refills
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {medications.current.reduce((sum, med) => sum + med.refills, 0)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Available refills</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
        {['current', 'past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-extrabold transition-all capitalize ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'current' ? 'Current Medications' : 'Past Medications'}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass-card rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2.5 glass-card rounded-xl text-xs font-extrabold flex items-center space-x-2 border-white/50">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Medications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredMedications.map((medication, idx) => {
            const nextDoseStatus = getNextDoseStatus(medication.nextDose);
            return (
              <motion.div
                key={medication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${getMedicationColor(medication.color)} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {medication.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-lg text-slate-800">{medication.name}</h3>
                        <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          {medication.dosage}
                        </span>
                        {nextDoseStatus && (
                          <span className={`text-xs font-extrabold px-2 py-1 rounded-lg ${
                            nextDoseStatus.color === 'red' ? 'text-red-600 bg-red-50' :
                            nextDoseStatus.color === 'amber' ? 'text-amber-600 bg-amber-50' :
                            nextDoseStatus.color === 'blue' ? 'text-blue-600 bg-blue-50' :
                            'text-green-600 bg-green-50'
                          }`}>
                            {nextDoseStatus.status}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-slate-600">
                            <span className="font-medium">Frequency:</span> {medication.frequency}
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium">Times:</span> {medication.time?.join(', ')}
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium">Instructions:</span> {medication.instructions}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-600">
                            <span className="font-medium">Prescribed by:</span> {medication.prescribedBy}
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium">Pharmacy:</span> {medication.pharmacy}
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium">Refills:</span> {medication.refills} available
                          </p>
                        </div>
                      </div>
                      
                      {medication.remaining !== undefined && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Supply remaining</span>
                            <span className="font-extrabold text-blue-600">
                              {medication.remaining} of {medication.total} days
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(medication.remaining / medication.total) * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                              className={`h-full rounded-full ${
                                medication.remaining < 7 ? 'bg-red-500' :
                                medication.remaining < 14 ? 'bg-amber-500' :
                                'bg-emerald-500'
                              }`}
                            />
                          </div>
                          {medication.remaining < 7 && (
                            <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                              <AlertTriangle className="text-red-600" size={14} />
                              <span className="text-xs text-red-700 font-medium">
                                Refill needed soon! {medication.remaining} days remaining
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Bell size={16} className="text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <RefreshCw size={16} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Upcoming Reminders */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <Bell className="mr-3 text-blue-600" />
              Upcoming Reminders
            </h2>
            <p className="text-sm text-slate-400 font-medium">Never miss a dose</p>
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-slate-600">Push notifications</span>
            </label>
          </div>
        </div>
        
        <div className="space-y-3">
          {upcomingReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="text-blue-600" size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{reminder.medication}</h4>
                  <p className="text-sm text-slate-500">{reminder.dose} • {reminder.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-extrabold px-2 py-1 rounded-lg ${
                  reminder.type === 'tonight' ? 'text-amber-600 bg-amber-50' :
                  reminder.type === 'today' ? 'text-blue-600 bg-blue-50' :
                  'text-slate-600 bg-slate-100'
                }`}>
                  {reminder.type}
                </span>
                <button className="text-blue-600 text-sm font-extrabold hover:underline">
                  Mark as taken
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Pharmacies */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <MapPin className="mr-3 text-blue-600" />
              Nearby Pharmacies
            </h2>
            <p className="text-sm text-slate-400 font-medium">Quick prescription refills</p>
          </div>
          <button className="text-blue-600 text-xs font-extrabold flex items-center hover:underline group">
            VIEW ALL <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pharmacies.map((pharmacy) => (
            <motion.div
              key={pharmacy.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-800">{pharmacy.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{pharmacy.address}</p>
                </div>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  {pharmacy.distance}
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Phone size={12} className="text-slate-400" />
                  <span className="text-slate-600">{pharmacy.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-slate-600">{pharmacy.hours}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {pharmacy.services.map((service, idx) => (
                      <span key={idx} className="text-xs font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < Math.floor(pharmacy.rating) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 ml-1">{pharmacy.rating}</span>
                </div>
                <button className="text-blue-600 text-xs font-extrabold hover:underline">
                  Request Refill
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Add Medication Modal */}
      <AnimatePresence>
        {showAddMedication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddMedication(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">Add New Medication</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Medication Name</label>
                  <input
                    type="text"
                    placeholder="Enter medication name"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g., 500mg"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Frequency</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Three times daily</option>
                      <option>As needed</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Instructions</label>
                  <textarea
                    placeholder="Special instructions..."
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddMedication(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-extrabold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddMedication(false)}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-extrabold hover:bg-blue-700"
                >
                  Add Medication
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicationManagement;
