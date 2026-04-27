import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Heart, Activity } from 'lucide-react';

const Loading = ({ 
  size = 'default', 
  message = 'Loading...', 
  type = 'default',
  fullScreen = false 
}) => {
  const getLoadingIcon = () => {
    switch(type) {
      case 'health':
        return <Heart className="animate-pulse" size={24} />;
      case 'activity':
        return <Activity className="animate-spin" size={24} />;
      default:
        return <Loader2 className="animate-spin" size={24} />;
    }
  };

  const getSizeClasses = () => {
    switch(size) {
      case 'small':
        return 'w-8 h-8';
      case 'large':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  const getContainerClasses = () => {
    if (fullScreen) {
      return 'fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50';
    }
    return 'flex items-center justify-center';
  };

  return (
    <div className={getContainerClasses()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className={`flex items-center justify-center ${getSizeClasses()} text-blue-600`}>
          {getLoadingIcon()}
        </div>
        
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-slate-600 font-medium text-center"
          >
            {message}
          </motion.p>
        )}
        
        {/* Professional loading dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0][index] }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 0.2
              }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          ))}
        </div>
        
        {/* Progress bar for full screen loading */}
        {fullScreen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-64 h-1 bg-slate-200 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              animate={{ x: ['-100%', '0%'] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Specialized loading components
export const HealthLoading = () => (
  <Loading 
    type="health" 
    message="Loading your health data..." 
    size="large" 
    fullScreen={true} 
  />
);

export const MedicationLoading = () => (
  <Loading 
    type="activity" 
    message="Syncing your medications..." 
    size="default" 
  />
);

export const AppointmentLoading = () => (
  <Loading 
    message="Finding available appointments..." 
    size="default" 
  />
);

export const ReportLoading = () => (
  <Loading 
    message="Uploading your medical reports..." 
    size="large" 
  />
);

export const TelemedicineLoading = () => (
  <Loading 
    message="Connecting to healthcare providers..." 
    size="large" 
    fullScreen={true} 
  />
);

export default Loading;
