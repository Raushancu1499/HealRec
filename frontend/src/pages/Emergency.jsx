import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Users, 
  ShieldCheck,
  Ambulance,
  Heart,
  Activity,
  Clock,
  MessageCircle,
  Share2,
  Download,
  ChevronRight,
  Battery,
  Wifi,
  Signal,
  Volume2,
  Bell,
  Cross,
  Stethoscope,
  User,
  Calendar,
  FileText,
  Camera,
  Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Emergency = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyCountdown, setEmergencyCountdown] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('Loading...');
  const [emergencyContacts] = useState([
    { id: 1, name: 'Dr. Sarah Mitchell', phone: '(555) 123-4567', type: 'doctor', relation: 'Primary Care' },
    { id: 2, name: 'John Smith', phone: '(555) 987-6543', type: 'family', relation: 'Spouse' },
    { id: 3, name: 'Emergency Services', phone: '911', type: 'emergency', relation: 'Emergency' },
    { id: 4, name: 'City General Hospital', phone: '(555) 456-7890', type: 'hospital', relation: 'Nearest Hospital' }
  ]);

  const [medicalInfo] = useState({
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    emergencyContact: 'John Smith (Spouse) - (555) 987-6543',
    doctor: 'Dr. Sarah Mitchell - (555) 123-4567',
    organDonor: true,
    medicalId: 'MRN-123456789'
  });

  const [nearbyHospitals] = useState([
    {
      id: 1,
      name: 'City General Hospital',
      address: '123 Medical Center Dr',
      distance: '0.8 miles',
      phone: '(555) 456-7890',
      emergency: true,
      rating: 4.5,
      waitTime: '15 min',
      specialties: ['Emergency', 'Cardiology', 'Trauma']
    },
    {
      id: 2,
      name: 'St. Mary\'s Medical Center',
      address: '456 Health Ave',
      distance: '2.3 miles',
      phone: '(555) 234-5678',
      emergency: true,
      rating: 4.7,
      waitTime: '25 min',
      specialties: ['Emergency', 'Pediatrics', 'Surgery']
    },
    {
      id: 3,
      name: 'Community Medical Center',
      address: '789 Care Blvd',
      distance: '3.1 miles',
      phone: '(555) 345-6789',
      emergency: false,
      rating: 4.2,
      waitTime: 'N/A',
      specialties: ['Urgent Care', 'Family Medicine']
    }
  ]);

  const [emergencyProtocols] = useState([
    {
      id: 1,
      title: 'Heart Attack',
      symptoms: ['Chest pain', 'Shortness of breath', 'Pain in arm/jaw'],
      actions: ['Call 911 immediately', 'Chew aspirin if available', 'Stay calm and rest'],
      icon: <Heart className="text-red-500" size={24} />
    },
    {
      id: 2,
      title: 'Stroke',
      symptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty'],
      actions: ['Call 911 immediately', 'Note time symptoms started', 'Don\'t give food/drink'],
      icon: <Activity className="text-purple-500" size={24} />
    },
    {
      id: 3,
      title: 'Severe Bleeding',
      symptoms: ['Heavy bleeding', 'Dizziness', 'Rapid heartbeat'],
      actions: ['Apply direct pressure', 'Elevate injured area', 'Call 911'],
      icon: <AlertTriangle className="text-red-500" size={24} />
    }
  ]);

  useEffect(() => {
    // Simulate getting current location
    setTimeout(() => {
      setCurrentLocation('123 Main St, City, State 12345');
    }, 2000);

    // Handle emergency countdown
    if (emergencyCountdown > 0) {
      const timer = setTimeout(() => {
        setEmergencyCountdown(emergencyCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (emergencyCountdown === 0 && isEmergencyActive) {
      triggerEmergency();
    }
  }, [emergencyCountdown, isEmergencyActive]);

  const triggerSOS = () => {
    setIsEmergencyActive(true);
    setEmergencyCountdown(5);
  };

  const cancelSOS = () => {
    setIsEmergencyActive(false);
    setEmergencyCountdown(0);
  };

  const triggerEmergency = () => {
    // In real app, this would:
    // 1. Call emergency services
    // 2. Send location to emergency contacts
    // 3. Share medical information
    // 4. Start recording
    console.log('EMERGENCY TRIGGERED');
  };

  const callEmergency = (number) => {
    window.open(`tel:${number}`);
  };

  const shareLocation = (contactId) => {
    // In real app, this would share location with contact
    console.log('Sharing location with contact:', contactId);
  };

  const getContactIcon = (type) => {
    switch(type) {
      case 'doctor': return <Stethoscope size={16} className="text-blue-600" />;
      case 'family': return <Users size={16} className="text-green-600" />;
      case 'emergency': return <AlertTriangle size={16} className="text-red-600" />;
      case 'hospital': return <Cross size={16} className="text-purple-600" />;
      default: return <User size={16} className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Emergency Services</h1>
          <p className="text-slate-500 font-medium">Quick access to emergency care and life-saving information.</p>
        </motion.div>
        
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <div className="flex items-center space-x-1">
            <MapPin size={16} />
            <span>{currentLocation}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Battery size={16} />
            <span>85%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Signal size={16} />
            <span>Strong</span>
          </div>
        </div>
      </header>

      {/* Emergency SOS Button */}
      <section className="glass-card p-8 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-red-800 mb-4">Emergency SOS</h2>
          <p className="text-red-600 mb-8">Press and hold for 5 seconds to activate emergency services</p>
          
          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onContextMenu={(e) => e.preventDefault()}
              onMouseDown={triggerSOS}
              onTouchStart={triggerSOS}
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isEmergencyActive 
                  ? 'bg-red-600 animate-pulse' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isEmergencyActive ? (
                <div className="text-white text-center">
                  <div className="text-3xl font-bold">{emergencyCountdown}</div>
                  <div className="text-xs">CANCEL</div>
                </div>
              ) : (
                <div className="text-white text-center">
                  <Phone size={32} />
                  <div className="text-xs mt-1">SOS</div>
                </div>
              )}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {isEmergencyActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <button
                  onClick={cancelSOS}
                  className="px-6 py-3 bg-white text-red-600 rounded-xl font-extrabold border-2 border-red-300"
                >
                  Cancel Emergency
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Quick Emergency Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => callEmergency('911')}
          className="glass-card p-6 text-left hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <Phone className="text-red-600" size={24} />
            </div>
            <ChevronRight className="text-slate-400" size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Call 911</h3>
          <p className="text-sm text-slate-600">Emergency services</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-card p-6 text-left hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Ambulance className="text-blue-600" size={24} />
            </div>
            <ChevronRight className="text-slate-400" size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Find Hospital</h3>
          <p className="text-sm text-slate-600">Nearest emergency room</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-card p-6 text-left hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Share2 className="text-purple-600" size={24} />
            </div>
            <ChevronRight className="text-slate-400" size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Share Location</h3>
          <p className="text-sm text-slate-600">Send to emergency contacts</p>
        </motion.button>
      </div>

      {/* Medical Information Card */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <ShieldCheck className="mr-3 text-blue-600" />
              Medical Information
            </h2>
            <p className="text-sm text-slate-400 font-medium">Critical medical details for emergency responders</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 glass-card rounded-lg hover:bg-blue-50">
              <Download size={16} className="text-blue-600" />
            </button>
            <button className="p-2 glass-card rounded-lg hover:bg-blue-50">
              <Share2 size={16} className="text-blue-600" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Blood Type</p>
              <p className="font-bold text-lg text-slate-800">{medicalInfo.bloodType}</p>
            </div>
            
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Allergies</p>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.allergies.map((allergy, idx) => (
                  <span key={idx} className="text-sm font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Medical Conditions</p>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.conditions.map((condition, idx) => (
                  <span key={idx} className="text-sm font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Current Medications</p>
              <div className="space-y-1">
                {medicalInfo.medications.map((med, idx) => (
                  <p key={idx} className="text-sm text-slate-700">{med}</p>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Emergency Contact</p>
              <p className="text-sm text-slate-700">{medicalInfo.emergencyContact}</p>
            </div>
            
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Primary Doctor</p>
              <p className="text-sm text-slate-700">{medicalInfo.doctor}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span>Medical ID: {medicalInfo.medicalId}</span>
            {medicalInfo.organDonor && (
              <div className="flex items-center space-x-1 text-emerald-600">
                <Heart size={14} className="fill-emerald-600" />
                <span>Organ Donor</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <Users className="mr-3 text-blue-600" />
              Emergency Contacts
            </h2>
            <p className="text-sm text-slate-400 font-medium">Quick access to important contacts</p>
          </div>
          <button className="text-blue-600 text-xs font-extrabold flex items-center hover:underline group">
            EDIT <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact) => (
            <motion.div
              key={contact.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {getContactIcon(contact.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{contact.name}</h4>
                    <p className="text-sm text-slate-500">{contact.relation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => callEmergency(contact.phone)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Phone size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => shareLocation(contact.id)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <MapPin size={16} className="text-blue-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nearby Hospitals */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <MapPin className="mr-3 text-blue-600" />
              Nearby Hospitals
            </h2>
            <p className="text-sm text-slate-400 font-medium">Emergency rooms and urgent care centers</p>
          </div>
          <button className="text-blue-600 text-xs font-extrabold flex items-center hover:underline group">
            VIEW MAP <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="space-y-4">
          {nearbyHospitals.map((hospital) => (
            <motion.div
              key={hospital.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    hospital.emergency ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {hospital.emergency ? (
                      <Ambulance className="text-red-600" size={20} />
                    ) : (
                      <Cross className="text-blue-600" size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-bold text-slate-800">{hospital.name}</h4>
                      {hospital.emergency && (
                        <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                          24/7 ER
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{hospital.address}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>{hospital.distance}</span>
                      <span>•</span>
                      <span>Wait: {hospital.waitTime}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Star className="text-amber-400 fill-amber-400" size={12} />
                        <span>{hospital.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hospital.specialties.map((specialty, idx) => (
                        <span key={idx} className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => callEmergency(hospital.phone)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Phone size={16} className="text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <MapPin size={16} className="text-blue-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency Protocols */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <AlertTriangle className="mr-3 text-amber-600" />
              Emergency Protocols
            </h2>
            <p className="text-sm text-slate-400 font-medium">Step-by-step emergency response guides</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emergencyProtocols.map((protocol) => (
            <motion.div
              key={protocol.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  {protocol.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-800">{protocol.title}</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Symptoms</p>
                  <div className="space-y-1">
                    {protocol.symptoms.map((symptom, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Actions</p>
                  <div className="space-y-1">
                    {protocol.actions.map((action, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Emergency;
