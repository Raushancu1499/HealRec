import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, Heart, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiUtils } from '../../services/api.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(apiUtils.handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoEmails = {
      'Patient': 'john.doe@healrec.com',
      'Doctor': 'sarah.mitchell@healrec.com',
      'Lab': 'lab.tech@healrec.com',
      'Admin': 'admin@healrec.com'
    };
    
    setEmail(demoEmails[role]);
    setPassword('demo123');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-2 text-gray-600">Authenticating...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="mesh-gradient opacity-30"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 rounded-[32px] border border-white/40 z-10"
      >
        <div className="text-center mb-10">
          <div className="bg-primary p-3 rounded-2xl w-fit mx-auto mb-4">
            <Heart size={32} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-muted">Access your medical records securely</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-600" size={20} />
              <span className="text-red-800 text-sm font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 text-foreground/80">Email Address</label>
            <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 transition-all shadow-sm">
              <Mail size={18} className="text-muted" />
              <input 
                type="email" 
                required
                placeholder="name@example.com"
                className="bg-transparent border-none outline-none px-3 w-full text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-foreground/80">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 transition-all shadow-sm">
              <Lock size={18} className="text-muted" />
              <input 
                type="password" 
                required
                placeholder="•••••••••"
                className="bg-transparent border-none outline-none px-3 w-full text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-1">
            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" id="remember" />
            <label htmlFor="remember" className="text-xs text-muted">Remember this device</label>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="btn-premium w-full py-4 flex items-center justify-center space-x-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                <span>Login to Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted">
            Don't have an account yet? 
            <Link to="/signup" className="text-primary font-bold ml-1 hover:underline">Create Account</Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-[10px] text-center uppercase tracking-widest text-muted font-bold mb-3">Quick Demo Access</p>
          <div className="grid grid-cols-2 gap-2">
            {['Patient', 'Doctor', 'Lab', 'Admin'].map(role => (
              <button 
                key={role}
                onClick={() => handleDemoLogin(role)}
                className="text-[10px] bg-white/50 px-3 py-2 rounded-lg border border-gray-100 hover:bg-white hover:border-primary/30 transition-all shadow-sm"
                disabled={isLoading}
              >
                <div className="text-left">
                  <div className="font-bold text-foreground/80">{role}</div>
                  <div className="text-[9px] text-muted truncate">
                    {role === 'Patient' && 'john.doe@healrec.com'}
                    {role === 'Doctor' && 'sarah.mitchell@healrec.com'}
                    {role === 'Lab' && 'lab.tech@healrec.com'}
                    {role === 'Admin' && 'admin@healrec.com'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
