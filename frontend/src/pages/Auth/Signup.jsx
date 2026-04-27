import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  FlaskConical, 
  Stethoscope, 
  ShieldCheck, 
  Building2,
  Phone,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUtils } from '../../services/api.js';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: 'Patient',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hospitalName: '',
    labName: '',
    specialty: '',
    licenseNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError('');
    }
  };

  const handleBack = () => setStep(step - 1);

  const validateStep = (currentStep) => {
    const errors = {};
    
    switch(currentStep) {
      case 1:
        if (!formData.role) errors.role = 'Please select a role';
        break;
      case 2:
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!formData.email.includes('@')) errors.email = 'Please enter a valid email';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        break;
      case 3:
        if (formData.role === 'Doctor' && !formData.hospitalName.trim()) errors.hospitalName = 'Hospital name is required';
        if (formData.role === 'Doctor' && !formData.specialty.trim()) errors.specialty = 'Specialty is required';
        if (formData.role === 'Lab' && !formData.labName.trim()) errors.labName = 'Lab name is required';
        if (formData.role === 'Lab' && !formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
        break;
      case 4:
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await signup({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone
      });
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(apiUtils.handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'Patient', label: 'Customer / Patient', description: 'Access records & book appointments', icon: <User size={24} />, color: 'var(--primary)' },
    { id: 'Doctor', label: 'Medical Doctor', description: 'Manage consultations & history', icon: <Stethoscope size={24} />, color: 'var(--accent)' },
    { id: 'Lab', label: 'Laboratory', description: 'Directly upload patient reports', icon: <FlaskConical size={24} />, color: 'var(--secondary)' },
    { id: 'Admin', label: 'Administrator', description: 'Platform management & analytics', icon: <ShieldCheck size={24} />, color: '#475569' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-tr from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-4 bg-white rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600 font-medium">Creating your account...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="mesh-gradient opacity-30"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-2xl p-10 rounded-[40px] border border-white/40 z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Join HealRec</h1>
          <p className="text-muted">Step {step} of 4: {step === 1 ? 'Select your role' : step === 2 ? 'Profile Information' : step === 3 ? 'Role-specific details' : 'Security'}</p>
          
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary' : 'bg-white/40'}`}></div>
            ))}
          </div>
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

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {roles.map((role) => (
                  <label 
                    key={role.id}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center space-y-3 ${
                      formData.role === role.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-white/40 bg-white/40 hover:border-white/60'
                    }`}
                  >
                    <input 
                      type="radio" 
                      className="hidden" 
                      name="role" 
                      value={role.id} 
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                    <div style={{ color: role.color }}>{role.icon}</div>
                    <h3 className="font-bold">{role.label}</h3>
                    <p className="text-xs text-muted">{role.description}</p>
                  </label>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 text-foreground/80">First Name</label>
                    <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                      <User size={18} className="text-muted" />
                      <input 
                        type="text" 
                        required
                        placeholder="John"
                        disabled={isLoading}
                        className="bg-transparent border-none outline-none px-3 w-full text-sm"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 text-foreground/80">Last Name</label>
                    <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                      <input 
                        type="text" 
                        required
                        placeholder="Doe"
                        disabled={isLoading}
                        className="bg-transparent border-none outline-none px-3 w-full text-sm"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-foreground/80">Email Address</label>
                  <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                    <Mail size={18} className="text-muted" />
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      disabled={isLoading}
                      className="bg-transparent border-none outline-none px-3 w-full text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-foreground/80">Phone Number</label>
                  <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                    <Phone size={18} className="text-muted" />
                    <input 
                      type="tel" 
                      required
                      placeholder="+1 (555) 000-0000"
                      disabled={isLoading}
                      className="bg-transparent border-none outline-none px-3 w-full text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {formData.role === 'Patient' && (
                  <div className="text-center py-12">
                    <div className="bg-green-100 text-green-600 p-4 rounded-full w-fit mx-auto mb-4">
                      <CheckCircle size={32} />
                    </div>
                    <p className="text-foreground/70 font-medium">Profile information complete!</p>
                    <p className="text-sm text-muted">Click continue to set up your secure password.</p>
                  </div>
                )}
                
                {formData.role === 'Doctor' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1 text-foreground/80">Hospital / Clinic Name</label>
                      <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                        <Building2 size={18} className="text-muted" />
                        <input 
                          type="text" required
                          placeholder="City General Hospital"
                          className="bg-transparent border-none outline-none px-3 w-full text-sm"
                          value={formData.hospitalName}
                          onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1 text-foreground/80">Specialty</label>
                      <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                        <input 
                          type="text" required
                          placeholder="e.g. Cardiology"
                          className="bg-transparent border-none outline-none px-3 w-full text-sm"
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.role === 'Lab' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1 text-foreground/80">Laboratory Name</label>
                      <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                        <FlaskConical size={18} className="text-muted" />
                        <input 
                          type="text" required
                          placeholder="Apex Diagnostics"
                          className="bg-transparent border-none outline-none px-3 w-full text-sm"
                          value={formData.labName}
                          onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1 text-foreground/80">Certification ID</label>
                      <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                        <input 
                          type="text" required
                          placeholder="CERT-12345"
                          className="bg-transparent border-none outline-none px-3 w-full text-sm"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-foreground/80">Create Password</label>
                  <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                    <Lock size={18} className="text-muted" />
                    <input 
                      type="password" required
                      placeholder="••••••••"
                      className="bg-transparent border-none outline-none px-3 w-full text-sm"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-foreground/80">Confirm Password</label>
                  <div className="flex items-center bg-white/60 px-4 py-3 rounded-xl border border-white focus-within:border-primary/50 shadow-sm transition-all">
                    <input 
                      type="password" required
                      placeholder="••••••••"
                      className="bg-transparent border-none outline-none px-3 w-full text-sm"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-12">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={handleBack}
                className="px-6 py-3 rounded-xl bg-white/40 border border-white/20 hover:bg-white/60 flex items-center space-x-2 font-bold transition-all"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 4 ? (
              <button 
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="btn-premium px-10 py-4 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span>{isLoading ? 'Processing...' : 'Continue'}</span>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            ) : (
              <button 
                type="submit"
                disabled={isLoading}
                className="btn-premium px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <p className="text-center mt-10 text-sm text-muted">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
