import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Target,
  Calendar,
  Heart,
  Activity,
  Droplets,
  Moon,
  BarChart3,
  Lightbulb,
  ShieldCheck,
  Zap,
  Clock,
  Award,
  ChevronRight,
  Info,
  Download,
  Share2,
  Filter,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HealthInsights = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [insightCategory, setInsightCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [healthScore] = useState({
    overall: 82,
    physical: 78,
    mental: 85,
    nutrition: 80,
    sleep: 88,
    trends: {
      physical: 'improving',
      mental: 'stable',
      nutrition: 'declining',
      sleep: 'improving'
    }
  });

  const [aiInsights] = useState([
    {
      id: 1,
      type: 'recommendation',
      priority: 'high',
      title: 'Increase Water Intake',
      description: 'Your hydration levels have been below optimal for 3 consecutive days. Aim for 8-10 glasses daily.',
      category: 'hydration',
      impact: 'high',
      actionItems: ['Set hourly reminders', 'Keep water bottle visible', 'Track intake in app'],
      confidence: 92,
      timeframe: 'immediate'
    },
    {
      id: 2,
      type: 'achievement',
      priority: 'medium',
      title: 'Exercise Goal Achieved!',
      description: 'You\'ve consistently met your step goal for 2 weeks. Your cardiovascular health is improving.',
      category: 'fitness',
      impact: 'positive',
      actionItems: ['Maintain current routine', 'Consider increasing intensity', 'Share achievement'],
      confidence: 98,
      timeframe: 'ongoing'
    },
    {
      id: 3,
      type: 'warning',
      priority: 'high',
      title: 'Sleep Pattern Disruption',
      description: 'Your sleep quality has decreased by 15% this week. Consider reducing screen time before bed.',
      category: 'sleep',
      impact: 'negative',
      actionItems: ['No screens 1hr before bed', 'Maintain consistent schedule', 'Try meditation'],
      confidence: 87,
      timeframe: 'this week'
    },
    {
      id: 4,
      type: 'prediction',
      priority: 'medium',
      title: 'Medication Adherence Risk',
      description: 'Based on current patterns, there\'s a 25% risk of missing doses this weekend.',
      category: 'medication',
      impact: 'medium',
      actionItems: ['Set weekend reminders', 'Prepare medication in advance', 'Notify caregiver'],
      confidence: 75,
      timeframe: 'upcoming'
    }
  ]);

  const [healthPredictions] = useState([
    {
      id: 1,
      metric: 'Blood Pressure',
      current: '120/80',
      predicted: '118/78',
      timeframe: '3 months',
      confidence: 85,
      factors: ['Exercise consistency', 'Medication adherence', 'Stress management'],
      trend: 'improving'
    },
    {
      id: 2,
      metric: 'Weight',
      current: '70.5 kg',
      predicted: '68.2 kg',
      timeframe: '6 months',
      confidence: 78,
      factors: ['Calorie deficit', 'Activity level', 'Metabolism'],
      trend: 'improving'
    },
    {
      id: 3,
      metric: 'Sleep Quality',
      current: '7.5 hrs',
      predicted: '8.2 hrs',
      timeframe: '2 months',
      confidence: 72,
      factors: ['Sleep hygiene', 'Stress reduction', 'Consistent schedule'],
      trend: 'improving'
    }
  ]);

  const [wellnessGoals] = useState([
    {
      id: 1,
      title: 'Daily Steps',
      current: 8432,
      goal: 10000,
      progress: 84,
      unit: 'steps',
      category: 'fitness',
      streak: 12
    },
    {
      id: 2,
      title: 'Sleep Duration',
      current: 7.5,
      goal: 8,
      progress: 94,
      unit: 'hours',
      category: 'sleep',
      streak: 8
    },
    {
      id: 3,
      title: 'Water Intake',
      current: 6,
      goal: 8,
      progress: 75,
      unit: 'glasses',
      category: 'hydration',
      streak: 3
    },
    {
      id: 4,
      title: 'Meditation',
      current: 15,
      goal: 20,
      progress: 75,
      unit: 'minutes',
      category: 'mental',
      streak: 5
    }
  ]);

  const [healthTrends] = useState([
    {
      metric: 'Heart Rate',
      data: [72, 75, 71, 73, 74, 72, 70],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      average: 72.4,
      status: 'normal'
    },
    {
      metric: 'Blood Pressure',
      data: [120, 118, 122, 119, 121, 120, 118],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      average: 119.7,
      status: 'optimal'
    },
    {
      metric: 'Sleep Quality',
      data: [7.2, 6.8, 7.5, 8.1, 7.5, 8.3, 7.9],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      average: 7.6,
      status: 'improving'
    }
  ]);

  const getInsightIcon = (type) => {
    switch(type) {
      case 'recommendation': return <Lightbulb className="text-blue-600" size={20} />;
      case 'achievement': return <Award className="text-emerald-600" size={20} />;
      case 'warning': return <AlertCircle className="text-amber-600" size={20} />;
      case 'prediction': return <Brain className="text-purple-600" size={20} />;
      default: return <Info className="text-slate-600" size={20} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return <TrendingUp className="text-emerald-500" size={16} />;
      case 'declining': return <TrendingUp className="text-red-500 rotate-180" size={16} />;
      case 'stable': return <div className="w-4 h-4 bg-blue-500 rounded-full" />;
      default: return <div className="w-4 h-4 bg-slate-500 rounded-full" />;
    }
  };

  const filteredInsights = aiInsights.filter(insight => {
    const matchesCategory = insightCategory === 'all' || insight.category === insightCategory;
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Health Insights</h1>
          <p className="text-slate-500 font-medium">AI-powered personalized health recommendations and predictions.</p>
        </motion.div>
        
        <div className="flex space-x-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2.5 glass-card rounded-xl text-xs font-extrabold border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <div className="flex space-x-2">
            <button className="p-2.5 glass-card rounded-xl hover:bg-blue-50">
              <Download size={16} className="text-blue-600" />
            </button>
            <button className="p-2.5 glass-card rounded-xl hover:bg-blue-50">
              <Share2 size={16} className="text-blue-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Health Score Overview */}
      <section className="glass-card p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <Brain className="mr-3 text-blue-600" />
              AI Health Score
            </h2>
            <p className="text-sm text-slate-400 font-medium">Comprehensive wellness assessment</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold text-blue-600">{healthScore.overall}</div>
            <div className="text-xs text-slate-500">Overall Score</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(healthScore).filter(([key]) => key !== 'overall' && key !== 'trends').map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-slate-200"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-800">{value}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-700 mt-2 capitalize">{key}</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                {getTrendIcon(healthScore.trends[key])}
                <span className="text-xs text-slate-500 capitalize">{healthScore.trends[key]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Insights */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <Lightbulb className="mr-3 text-blue-600" />
              AI-Powered Insights
            </h2>
            <p className="text-sm text-slate-400 font-medium">Personalized recommendations based on your health data</p>
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 glass-card rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select 
              value={insightCategory}
              onChange={(e) => setInsightCategory(e.target.value)}
              className="px-4 py-2 glass-card rounded-xl text-sm font-extrabold border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="fitness">Fitness</option>
              <option value="sleep">Sleep</option>
              <option value="hydration">Hydration</option>
              <option value="medication">Medication</option>
              <option value="nutrition">Nutrition</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredInsights.map((insight, idx) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-xl border-2 ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{insight.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                          {insight.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-extrabold px-2 py-1 rounded-lg ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-700 mb-4">{insight.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recommended Actions</p>
                  <div className="space-y-1">
                    {insight.actionItems.map((action, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-sm text-slate-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                  <span className="text-xs text-slate-500">
                    {insight.timeframe === 'immediate' ? 'Act now' :
                     insight.timeframe === 'this week' ? 'This week' :
                     insight.timeframe === 'upcoming' ? 'Upcoming' :
                     insight.timeframe === 'ongoing' ? 'Ongoing' : insight.timeframe}
                  </span>
                  <button className="text-blue-600 text-xs font-extrabold hover:underline flex items-center">
                    Take Action <ChevronRight size={12} className="ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Health Predictions */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <BarChart3 className="mr-3 text-blue-600" />
              Health Predictions
            </h2>
            <p className="text-sm text-slate-400 font-medium">AI-powered forecasts based on current trends</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {healthPredictions.map((prediction) => (
            <motion.div
              key={prediction.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800">{prediction.metric}</h3>
                {getTrendIcon(prediction.trend)}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Current</span>
                  <span className="font-bold text-slate-800">{prediction.current}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Predicted</span>
                  <span className="font-bold text-blue-600">{prediction.predicted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Timeframe</span>
                  <span className="text-sm text-slate-700">{prediction.timeframe}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Confidence</span>
                  <span className="text-sm font-extrabold text-slate-700">{prediction.confidence}%</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Key Factors</p>
                <div className="flex flex-wrap gap-1">
                  {prediction.factors.map((factor, idx) => (
                    <span key={idx} className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Wellness Goals */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <Target className="mr-3 text-blue-600" />
              Wellness Goals
            </h2>
            <p className="text-sm text-slate-400 font-medium">Track your daily health objectives</p>
          </div>
          <button className="text-blue-600 text-xs font-extrabold flex items-center hover:underline group">
            EDIT GOALS <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wellnessGoals.map((goal) => (
            <motion.div
              key={goal.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{goal.title}</h3>
                  <p className="text-sm text-slate-500">
                    {goal.current} of {goal.goal} {goal.unit}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Zap className="text-amber-500" size={16} />
                    <span className="text-sm font-bold text-amber-600">{goal.streak} days</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-extrabold text-blue-600">{goal.progress}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${
                      goal.progress >= 80 ? 'bg-emerald-500' :
                      goal.progress >= 60 ? 'bg-blue-500' :
                      goal.progress >= 40 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  {goal.category}
                </span>
                <button className="text-blue-600 text-xs font-extrabold hover:underline">
                  Update Progress
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Health Trends */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <TrendingUp className="mr-3 text-blue-600" />
              Health Trends
            </h2>
            <p className="text-sm text-slate-400 font-medium">Weekly health metrics analysis</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {healthTrends.map((trend) => (
            <div key={trend.metric} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800">{trend.metric}</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500">Avg: {trend.average}</span>
                  <span className={`text-xs font-extrabold px-2 py-1 rounded-lg ${
                    trend.status === 'optimal' ? 'text-emerald-600 bg-emerald-50' :
                    trend.status === 'improving' ? 'text-blue-600 bg-blue-50' :
                    trend.status === 'normal' ? 'text-slate-600 bg-slate-50' :
                    'text-amber-600 bg-amber-50'
                  }`}>
                    {trend.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-end space-x-2 h-24">
                {trend.data.map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / Math.max(...trend.data)) * 100}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-slate-400">
                {trend.labels.map((label) => (
                  <span key={label} className="w-8 text-center">{label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HealthInsights;
