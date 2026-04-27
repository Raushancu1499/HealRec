import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Droplets, 
  Moon, 
  TrendingUp, 
  Calendar,
  Plus,
  Settings,
  Smartphone,
  Watch,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HealthTracking = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: { current: 72, average: 68, trend: 'stable' },
    steps: { current: 8432, goal: 10000, trend: 'up' },
    sleep: { current: 7.5, goal: 8, trend: 'stable' },
    water: { current: 6, goal: 8, trend: 'down' },
    weight: { current: 70.5, goal: 68, trend: 'down' },
    bloodPressure: { systolic: 120, diastolic: 80, trend: 'stable' }
  });

  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Apple Watch Series 8', type: 'watch', connected: true, battery: 85 },
    { id: 2, name: 'iPhone Health', type: 'phone', connected: true, lastSync: '2 min ago' },
    { id: 3, name: 'Fitbit Charge 5', type: 'watch', connected: false, battery: 45 }
  ]);

  const [weeklyData] = useState([
    { day: 'Mon', heartRate: 68, steps: 7500, sleep: 7.2, water: 7 },
    { day: 'Tue', heartRate: 72, steps: 9200, sleep: 6.8, water: 8 },
    { day: 'Wed', heartRate: 70, steps: 8100, sleep: 7.5, water: 6 },
    { day: 'Thu', heartRate: 75, steps: 10500, sleep: 8.1, water: 9 },
    { day: 'Fri', heartRate: 71, steps: 8432, sleep: 7.5, water: 6 },
    { day: 'Sat', heartRate: 69, steps: 6800, sleep: 8.3, water: 8 },
    { day: 'Sun', heartRate: 67, steps: 5200, sleep: 7.9, water: 7 }
  ]);

  const [healthAlerts] = useState([
    { id: 1, type: 'warning', message: 'Heart rate slightly elevated during rest', time: '2 hours ago' },
    { id: 2, type: 'success', message: 'Daily step goal achieved 5 days this week!', time: '1 day ago' },
    { id: 3, type: 'info', message: 'Sleep quality improved by 15%', time: '2 days ago' }
  ]);

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="text-emerald-500" size={16} />;
      case 'down': return <TrendingUp className="text-red-500 rotate-180" size={16} />;
      default: return <div className="w-4 h-4 bg-blue-500 rounded-full" />;
    }
  };

  const getMetricIcon = (metric) => {
    const icons = {
      heartRate: <Heart className="text-red-500" />,
      steps: <Activity className="text-blue-500" />,
      sleep: <Moon className="text-purple-500" />,
      water: <Droplets className="text-cyan-500" />,
      weight: <BarChart3 className="text-orange-500" />,
      bloodPressure: <Heart className="text-pink-500" />
    };
    return icons[metric] || <Activity className="text-gray-500" />;
  };

  const getDeviceIcon = (type) => {
    return type === 'watch' ? <Watch size={20} /> : <Smartphone size={20} />;
  };

  const handleSyncDevice = (deviceId) => {
    setConnectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: !device.connected, lastSync: 'Just now' }
          : device
      )
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Health Tracking</h1>
          <p className="text-slate-500 font-medium">Real-time health metrics and insights from your connected devices.</p>
        </motion.div>
        
        <div className="flex space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2.5 glass-card rounded-xl text-xs font-extrabold border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-premium flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Log Data</span>
          </motion.button>
        </div>
      </header>

      {/* Health Alerts */}
      <AnimatePresence>
        {healthAlerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {healthAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-xl border flex items-start space-x-3 ${
                alert.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                alert.type === 'success' ? 'bg-emerald-50 border-emerald-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className={`p-1.5 rounded-lg ${
                  alert.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  alert.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {alert.type === 'warning' ? <AlertCircle size={16} /> :
                   alert.type === 'success' ? <CheckCircle2 size={16} /> :
                   <AlertCircle size={16} />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    alert.type === 'warning' ? 'text-amber-800' :
                    alert.type === 'success' ? 'text-emerald-800' :
                    'text-blue-800'
                  }`}>{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(healthMetrics).map(([key, metric], idx) => (
          <motion.div 
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-100 rounded-xl">
                  {getMetricIcon(key)}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getTrendIcon(metric.trend)}
                    <span className="text-xs text-slate-500 capitalize">{metric.trend}</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <Settings size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {key === 'bloodPressure' ? `${metric.systolic}/${metric.diastolic}` : metric.current}
                </h3>
                <span className="text-xs text-slate-400">
                  {key === 'heartRate' ? 'bpm' :
                   key === 'steps' ? 'steps' :
                   key === 'sleep' ? 'hrs' :
                   key === 'water' ? 'glasses' :
                   key === 'weight' ? 'kg' :
                   key === 'bloodPressure' ? 'mmHg' : ''}
                </span>
              </div>
              
              {metric.goal && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Goal: {metric.goal}</span>
                    <span className="font-extrabold text-blue-600">
                      {Math.round((metric.current / metric.goal) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((metric.current / metric.goal) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Connected Devices */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <Smartphone className="mr-3 text-blue-600" />
              Connected Devices
            </h2>
            <p className="text-sm text-slate-400 font-medium">Manage your health data sources</p>
          </div>
          <button className="text-blue-600 text-xs font-extrabold flex items-center hover:underline group">
            ADD DEVICE <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedDevices.map((device) => (
            <motion.div 
              key={device.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                device.connected 
                  ? 'border-blue-200 bg-blue-50/30' 
                  : 'border-slate-200 bg-slate-50/30'
              }`}
              onClick={() => handleSyncDevice(device.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    device.connected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{device.name}</h4>
                    <p className="text-xs text-slate-500 capitalize">{device.type}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  device.connected ? 'bg-emerald-500' : 'bg-slate-300'
                }`} />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${
                  device.connected ? 'text-emerald-600' : 'text-slate-500'
                }`}>
                  {device.connected ? 'Connected' : 'Disconnected'}
                </span>
                {device.battery && (
                  <span className="text-slate-400">Battery: {device.battery}%</span>
                )}
                {device.lastSync && (
                  <span className="text-slate-400">Sync: {device.lastSync}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Weekly Trends Chart */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <BarChart3 className="mr-3 text-blue-600" />
              Weekly Trends
            </h2>
            <p className="text-sm text-slate-400 font-medium">Your health metrics over the past week</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {['steps', 'heartRate', 'sleep'].map((metric) => (
            <div key={metric} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getMetricIcon(metric)}
                  <span className="text-sm font-bold text-slate-700 capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span>Avg: {Math.round(weeklyData.reduce((sum, day) => sum + day[metric], 0) / weeklyData.length)}</span>
                  <Target size={14} />
                </div>
              </div>
              
              <div className="flex items-end space-x-2 h-20">
                {weeklyData.map((day, idx) => (
                  <motion.div
                    key={day.day}
                    initial={{ height: 0 }}
                    animate={{ height: `${(day[metric] / Math.max(...weeklyData.map(d => d[metric]))) * 100}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg relative group cursor-pointer"
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day[metric]}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-slate-400">
                {weeklyData.map(day => (
                  <span key={day.day} className="w-8 text-center">{day.day}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HealthTracking;
