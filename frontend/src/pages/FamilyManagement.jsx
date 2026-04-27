import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Calendar, 
  Heart,
  Activity,
  Pill,
  AlertCircle,
  CheckCircle2,
  Settings,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  FileText,
  TrendingUp,
  Star,
  Baby,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { familyAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import { apiUtils } from '../services/api.js';

const FamilyManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [familyMembers, setFamilyMembers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [careActivities, setCareActivities] = useState([]);
  const [healthAlerts, setHealthAlerts] = useState([]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('Spouse');
  const [invitePermissions, setInvitePermissions] = useState(['view_medical']);
  const [inviteMessage, setInviteMessage] = useState('');

  const [permissionLevels] = useState([
    {
      id: 'view_medical',
      name: 'View Medical Records',
      description: 'Access to medical history, test results, and reports',
      category: 'medical'
    },
    {
      id: 'manage_appointments',
      name: 'Manage Appointments',
      description: 'Schedule, cancel, and modify appointments',
      category: 'appointments'
    },
    {
      id: 'manage_medications',
      name: 'Manage Medications',
      description: 'Add, edit, and track medications and refills',
      category: 'medications'
    },
    {
      id: 'view_reports',
      name: 'View Lab Reports',
      description: 'Access lab results and diagnostic reports',
      category: 'reports'
    },
    {
      id: 'emergency_contact',
      name: 'Emergency Contact',
      description: 'Receive emergency notifications and alerts',
      category: 'emergency'
    }
  ]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [membersRes, invitesRes, activitiesRes, alertsRes] = await Promise.all([
        familyAPI.getMembers(),
        familyAPI.getInvites(),
        familyAPI.getActivities(),
        familyAPI.getHealthAlerts()
      ]);

      if (membersRes.success) setFamilyMembers(membersRes.data.members);
      if (invitesRes.success) setPendingInvites(invitesRes.data.pendingInvites);
      if (activitiesRes.success) setCareActivities(activitiesRes.data.activities);
      if (alertsRes.success) setHealthAlerts(alertsRes.data.healthAlerts);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching family data:', err);
      setError('Failed to load family information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionIcon = (category) => {
    switch(category) {
      case 'medical': return <FileText size={16} className="text-blue-600" />;
      case 'appointments': return <Calendar size={16} className="text-emerald-600" />;
      case 'medications': return <Pill size={16} className="text-purple-600" />;
      case 'reports': return <Activity size={16} className="text-amber-600" />;
      case 'emergency': return <AlertCircle size={16} className="text-red-600" />;
      default: return <Settings size={16} className="text-slate-600" />;
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'medication': return <Pill size={16} className="text-purple-600" />;
      case 'appointment': return <Calendar size={16} className="text-emerald-600" />;
      case 'health_metric': return <Activity size={16} className="text-blue-600" />;
      case 'emergency': return <AlertCircle size={16} className="text-red-600" />;
      default: return <Users size={16} className="text-slate-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handleInviteMember = async () => {
    try {
      setIsLoading(true);
      const inviteData = {
        email: inviteEmail,
        relationship: inviteRelationship,
        permissions: invitePermissions,
        message: inviteMessage
      };

      const response = await familyAPI.inviteMember(inviteData);
      
      if (response.success) {
        setShowInviteModal(false);
        // Reset form
        setInviteEmail('');
        setInviteRelationship('Spouse');
        setInvitePermissions(['view_medical']);
        setInviteMessage('');
        // Refresh data
        fetchData();
      }
    } catch (err) {
      console.error('Error inviting member:', err);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (permId) => {
    setInvitePermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(p => p !== permId) 
        : [...prev, permId]
    );
  };

  const handleEditPermissions = (memberId) => {
    setSelectedMember(memberId);
  };

  if (isLoading && familyMembers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Family Management</h1>
          <p className="text-slate-500 font-medium">Manage family members, caregivers, and shared health information.</p>
        </motion.div>
        
        <div className="flex space-x-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2.5 glass-card rounded-xl text-xs font-extrabold flex items-center space-x-2 border-white/50"
          >
            <Bell size={16} />
            <span>Notifications</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-premium flex items-center space-x-2"
            onClick={handleInviteMember}
          >
            <UserPlus size={18} />
            <span>Invite Member</span>
          </motion.button>
        </div>
      </header>

      {/* Family Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-blue-600" size={20} />
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{familyMembers.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Family members</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck className="text-emerald-600" size={20} />
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              Caregivers
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {familyMembers.filter(m => m.permissions.includes('emergency_contact')).length}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Emergency contacts</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-purple-600" size={20} />
            <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
              Today
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {careActivities.filter(a => a.time.includes('hour')).length}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Care activities</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="text-amber-600" size={20} />
            <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{healthAlerts.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Health alerts</p>
        </div>
      </div>

      {/* Health Alerts */}
      {healthAlerts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center">
            <AlertCircle className="mr-3 text-amber-600" />
            Health Alerts
          </h2>
          {healthAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border-2 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-lg">
                    {getActivityIcon(alert.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{alert.memberName}</h4>
                    <p className="text-sm text-slate-700 mt-1">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{alert.time}</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-extrabold hover:underline">
                  {alert.action === 'order_refill' ? 'Order Refill' :
                   alert.action === 'schedule' ? 'Schedule' : 'View Details'}
                </button>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
        {['members', 'activities', 'permissions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-extrabold transition-all capitalize ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'members' ? 'Family Members' :
             tab === 'activities' ? 'Care Activities' :
             'Permissions'}
          </button>
        ))}
      </div>

      {/* Family Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Active Members */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Active Members</h3>
            {familyMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                        member.pediatric ? 'bg-pink-500' :
                        member.professional ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`}>
                        {member.avatar}
                      </div>
                      {member.emergencyContact && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <ShieldCheck size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-bold text-lg text-slate-800">{member.name}</h3>
                        {member.pediatric && <Baby size={16} className="text-pink-500" />}
                        {member.professional && <User size={16} className="text-purple-500" />}
                        <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          {member.relationship}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>Age: {member.age}</span>
                        <span>Blood Type: {member.bloodType}</span>
                        {member.healthScore && (
                          <div className="flex items-center space-x-1">
                            <Heart size={12} className="text-red-500" />
                            <span>Score: {member.healthScore}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                        <div className="flex items-center space-x-1">
                          <Mail size={12} />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone size={12} />
                          <span>{member.phone}</span>
                        </div>
                        <span>Last active: {member.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MessageCircle size={16} className="text-slate-400" />
                    </button>
                    <button 
                      onClick={() => handleEditPermissions(member.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Settings size={16} className="text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit size={16} className="text-slate-400" />
                    </button>
                  </div>
                </div>
                
                {/* Member Health Summary */}
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Conditions</p>
                    {member.conditions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {member.conditions.map((condition, idx) => (
                          <span key={idx} className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            {condition}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Medications</p>
                    {member.medications.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {member.medications.map((med, idx) => (
                          <span key={idx} className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                            {med}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Permissions</p>
                    <div className="flex flex-wrap gap-1">
                      {member.permissions.slice(0, 2).map((perm, idx) => (
                        <span key={idx} className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {perm.replace('_', ' ')}
                        </span>
                      ))}
                      {member.permissions.length > 2 && (
                        <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          +{member.permissions.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Pending Invitations</h3>
              {pendingInvites.map((invite) => (
                <motion.div
                  key={invite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-amber-200 bg-amber-50 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{invite.email}</h4>
                      <div className="flex items-center space-x-3 text-sm text-slate-600 mt-1">
                        <span>{invite.relationship}</span>
                        <span>•</span>
                        <span>Invited: {invite.invitedDate}</span>
                        <span>•</span>
                        <span>By: {invite.invitedBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-amber-600 text-sm font-extrabold hover:underline">
                        Resend
                      </button>
                      <button className="text-red-600 text-sm font-extrabold hover:underline">
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Care Activities Tab */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">Recent Care Activities</h3>
          {careActivities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{activity.memberName}</h4>
                    <p className="text-sm text-slate-700 mt-1">{activity.description}</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>Caregiver: {activity.caregiver}</span>
                    </div>
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-extrabold hover:underline">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Permission Levels</h3>
            <button className="text-blue-600 text-xs font-extrabold hover:underline">
              Create Custom Permission
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {permissionLevels.map((permission) => (
              <motion.div
                key={permission.id}
                whileHover={{ scale: 1.02 }}
                className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {getPermissionIcon(permission.category)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{permission.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{permission.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        {permission.category}
                      </span>
                      <button className="text-blue-600 text-xs font-extrabold hover:underline">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">Invite Family Member</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Relationship</label>
                  <select 
                    value={inviteRelationship}
                    onChange={(e) => setInviteRelationship(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Child</option>
                    <option>Sibling</option>
                    <option>Other Family</option>
                    <option>Caregiver</option>
                    <option>Healthcare Provider</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Initial Permissions</label>
                  <div className="space-y-2">
                    {permissionLevels.map((permission) => (
                      <label key={permission.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600"
                          checked={invitePermissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                        />
                        <span className="text-sm text-slate-700">{permission.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Personal Message (Optional)</label>
                  <textarea
                    placeholder="Add a personal message..."
                    rows={3}
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-extrabold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteMember}
                  disabled={!inviteEmail || isLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-extrabold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyManagement;
