import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Heart, 
  Activity, 
  Video, 
  Users, 
  Smartphone
} from 'lucide-react';

const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    
    // Auto-remove after 5 seconds for non-critical notifications
    if (notification.type !== 'emergency') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Listen for custom events from socket service
  useEffect(() => {
    const handleHealthUpdate = (event) => {
      addNotification({
        type: 'health',
        title: 'Health Data Updated',
        message: 'Your health metrics have been updated.',
        icon: <Activity className="text-blue-600" size={20} />,
        color: 'blue'
      });
    };

    const handleMedicationReminder = (event) => {
      addNotification({
        type: 'medication',
        title: 'Medication Reminder',
        message: event.detail.message,
        icon: <Heart className="text-purple-600" size={20} />,
        color: 'purple'
      });
    };

    const handleEmergencyAlert = (event) => {
      addNotification({
        type: 'emergency',
        title: '🚨 EMERGENCY ALERT',
        message: event.detail.message,
        icon: <AlertTriangle className="text-red-600" size={20} />,
        color: 'red'
      });
    };

    const handleAppointmentUpdate = (event) => {
      addNotification({
        type: 'appointment',
        title: 'Appointment Update',
        message: event.detail.message,
        icon: <Video className="text-emerald-600" size={20} />,
        color: 'emerald'
      });
    };

    const handleFamilyActivity = (event) => {
      addNotification({
        type: 'family',
        title: 'Family Activity',
        message: event.detail.message,
        icon: <Users className="text-indigo-600" size={20} />,
        color: 'indigo'
      });
    };

    const handleTelemedicineEvent = (event) => {
      addNotification({
        type: 'telemedicine',
        title: 'Telemedicine Update',
        message: event.detail.message,
        icon: <Video className="text-cyan-600" size={20} />,
        color: 'cyan'
      });
    };

    // Add event listeners
    window.addEventListener('healthUpdate', handleHealthUpdate);
    window.addEventListener('medicationReminder', handleMedicationReminder);
    window.addEventListener('emergencyAlert', handleEmergencyAlert);
    window.addEventListener('appointmentUpdate', handleAppointmentUpdate);
    window.addEventListener('familyActivity', handleFamilyActivity);
    window.addEventListener('telemedicineEvent', handleTelemedicineEvent);

    // Cleanup
    return () => {
      window.removeEventListener('healthUpdate', handleHealthUpdate);
      window.removeEventListener('medicationReminder', handleMedicationReminder);
      window.removeEventListener('emergencyAlert', handleEmergencyAlert);
      window.removeEventListener('appointmentUpdate', handleAppointmentUpdate);
      window.removeEventListener('familyActivity', handleFamilyActivity);
      window.removeEventListener('telemedicineEvent', handleTelemedicineEvent);
    };
  }, [addNotification]);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'health': return <Activity className="text-blue-600" size={16} />;
      case 'medication': return <Heart className="text-purple-600" size={16} />;
      case 'emergency': return <AlertTriangle className="text-red-600" size={16} />;
      case 'appointment': return <Video className="text-emerald-600" size={16} />;
      case 'family': return <Users className="text-indigo-600" size={16} />;
      case 'telemedicine': return <Video className="text-cyan-600" size={16} />;
      default: return <Bell className="text-slate-600" size={16} />;
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'health': return 'border-blue-200 bg-blue-50';
      case 'medication': return 'border-purple-200 bg-purple-50';
      case 'emergency': return 'border-red-200 bg-red-50';
      case 'appointment': return 'border-emerald-200 bg-emerald-50';
      case 'family': return 'border-indigo-200 bg-indigo-50';
      case 'telemedicine': return 'border-cyan-200 bg-cyan-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Notification Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {notifications.length > 99 ? '99+' : notifications.length}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed top-20 right-4 w-96 max-h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center">
                <Bell className="mr-2 text-blue-600" size={20} />
                Notifications
              </h3>
              <button
                onClick={() => setNotifications([])}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Bell className="mx-auto mb-4 text-slate-300" size={32} />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        notification.read ? 'opacity-60' : ''
                      } ${getNotificationColor(notification.type)}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-slate-900 text-sm">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-slate-500">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            {notification.message}
                          </p>
                        </div>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="flex-shrink-0 text-slate-400 hover:text-slate-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RealTimeNotifications;
