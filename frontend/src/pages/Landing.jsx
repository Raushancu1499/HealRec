import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Activity, 
  Video, 
  AlertTriangle,
  Smartphone,
  BarChart3,
  ChevronRight,
  Play,
  CheckCircle2,
  Star,
  ArrowRight,
  Menu,
  X,
  Zap,
  Globe,
  Clock,
  Award,
  Pill
} from 'lucide-react';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Activity className="text-blue-600" size={32} />,
      title: "Health Tracking",
      description: "Monitor vital signs, track fitness goals, and sync with wearable devices for comprehensive health insights.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Pill className="text-purple-600" size={32} />,
      title: "Medication Management",
      description: "Smart reminders, refill tracking, and drug interaction alerts to ensure medication adherence.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Video className="text-emerald-600" size={32} />,
      title: "Telemedicine",
      description: "Connect with healthcare providers through video consultations and virtual appointments.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <AlertTriangle className="text-red-600" size={32} />,
      title: "Emergency Services",
      description: "SOS functionality, emergency contacts, and nearby hospital location services.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: <Users className="text-indigo-600" size={32} />,
      title: "Family Management",
      description: "Coordinate care with family members and manage caregiver access permissions.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <BarChart3 className="text-amber-600" size={32} />,
      title: "Health Insights",
      description: "AI-powered recommendations and predictive analytics for personalized health guidance.",
      color: "from-amber-500 to-yellow-500"
    }
  ];

  const stats = [
    { number: "10M+", label: "Active Users", icon: <Users size={20} /> },
    { number: "50+", label: "Healthcare Providers", icon: <Heart size={20} /> },
    { number: "99.9%", label: "Uptime", icon: <ShieldCheck size={20} /> },
    { number: "24/7", label: "Support", icon: <Clock size={20} /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "HealRec has transformed how I manage my health. The medication reminders and telemedicine features are lifesavers!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content: "As a healthcare provider, HealRec makes it easy to connect with patients and monitor their progress remotely.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Caregiver",
      content: "The family management features help me coordinate care for my elderly parents. Absolutely essential!",
      rating: 5,
      avatar: "ER"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Heart className="text-white" size={24} fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-slate-800">HealRec</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Testimonials
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Sign In
              </button>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 py-4"
              >
                <div className="flex flex-col space-y-4 px-6">
                  <button 
                    onClick={() => { scrollToSection('features'); setIsMenuOpen(false); }}
                    className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-left"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => { scrollToSection('testimonials'); setIsMenuOpen(false); }}
                    className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-left"
                  >
                    Testimonials
                  </button>
                  <button 
                    onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
                  >
                    Get Started
                  </button>
                  <button 
                    onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium w-full"
                  >
                    Sign In
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                  Your Complete
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Healthcare Solution
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  World-class healthcare management platform that puts you in control of your health journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button 
                    onClick={() => navigate('/signup')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
                  >
                    Start Free Trial
                  </button>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold text-lg"
                  >
                    <Play size={20} className="inline mr-2" />
                    Watch Demo
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Animated Feature Display */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeature}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${features[currentFeature].color}`}>
                        {features[currentFeature].icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mt-4">
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-slate-600 mt-2">
                        {features[currentFeature].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}Better Health
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive features designed to make healthcare management simple and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                <button 
                  onClick={() => navigate('/signup')} 
                  className="mt-6 flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  Learn more <ArrowRight size={16} className="ml-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trusted by Millions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what our users have to say about their experience with HealRec.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 p-8 rounded-2xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-slate-600 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join millions of users who trust HealRec for their healthcare management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold text-lg shadow-xl"
              >
                Start Free Trial
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-semibold text-lg"
              >
                Sign In to Account
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Heart className="text-white" size={20} fill="currentColor" />
                </div>
                <span className="text-xl font-bold">HealRec</span>
              </div>
              <p className="text-slate-400">
                Your complete healthcare management solution.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/signup" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/signup" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">HIPAA Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 HealRec. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
