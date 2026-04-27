import React, { useState } from 'react';
import { 
  Search, 
  Video, 
  Phone, 
  MoreVertical, 
  Send,
  Paperclip,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);

  const contacts = [
    { id: 1, name: 'Dr. Sarah Mitchell', role: 'Cardiology', lastMessage: 'Your test results look good.', time: '10:30 AM', unread: 2, online: true },
    { id: 2, name: 'City General Clinic', role: 'Support Team', lastMessage: 'Appointment confirmed for tomorrow.', time: 'Yesterday', unread: 0, online: true },
    { id: 3, name: 'Dr. Rahul Sharma', role: 'Dermatology', lastMessage: 'Please apply the cream twice daily.', time: 'Monday', unread: 0, online: false },
  ];

  const chatHistory = [
    { id: 1, sender: 'doctor', text: 'Hello John, I have reviewed your recent ECG results.', time: '10:15 AM' },
    { id: 2, sender: 'doctor', text: 'Everything looks completely normal. No cause for concern.', time: '10:16 AM' },
    { id: 3, sender: 'patient', text: 'That is great news, thank you doctor. Should I continue the medication?', time: '10:20 AM' },
    { id: 4, sender: 'doctor', text: 'Yes, please continue the current dosage. We will review it in 3 months.', time: '10:30 AM' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] max-w-7xl mx-auto glass-card p-0 flex overflow-hidden border-white/60 shadow-2xl">
      {/* Sidebar / Contacts List */}
      <div className="w-full md:w-80 border-r border-slate-200/50 bg-white/30 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200/50">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-4">Secure Inbox</h2>
            <div className="flex items-center bg-white/60 px-3 py-2.5 rounded-xl border border-white focus-within:bg-white transition-all">
                <Search size={16} className="text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search messages..."
                    className="bg-transparent border-none outline-none px-3 w-full text-xs font-bold text-slate-700"
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {contacts.map(contact => (
                <div 
                    key={contact.id}
                    onClick={() => setActiveChat(contact.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all ${
                        activeChat === contact.id 
                        ? 'bg-white shadow-md border border-blue-100' 
                        : 'hover:bg-white/50 border border-transparent'
                    }`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                            <h4 className="text-sm font-extrabold text-slate-900 truncate pr-2">{contact.name}</h4>
                            {contact.online && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{contact.time}</span>
                    </div>
                    <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">{contact.role}</p>
                    <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${contact.unread ? 'font-bold text-slate-800' : 'text-slate-500 font-medium'}`}>
                            {contact.lastMessage}
                        </p>
                        {contact.unread > 0 && (
                            <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ml-2">
                                {contact.unread}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-200/50 bg-white/40 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-extrabold shadow-lg">
                    SM
                </div>
                <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Dr. Sarah Mitchell</h3>
                    <div className="flex items-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div>
                        Online • Secure Connection
                    </div>
                </div>
            </div>
            <div className="flex space-x-2">
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                    <Phone size={18} />
                </button>
                <button className="p-2.5 bg-blue-600 border border-blue-600 rounded-xl text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                    <Video size={18} />
                </button>
                <div className="w-px h-10 bg-slate-200 mx-2"></div>
                <button className="p-2.5 text-slate-400 hover:text-slate-600 transition-all">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-full">Today</span>
            </div>
            
            {chatHistory.map(msg => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
                >
                    <div className="flex items-end space-x-2">
                        {msg.sender === 'doctor' && (
                            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-extrabold mb-1">
                                SM
                            </div>
                        )}
                        <div 
                            className={`max-w-md px-5 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                                msg.sender === 'patient' 
                                ? 'bg-blue-600 text-white rounded-br-sm' 
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                    <div className="flex items-center mt-1 space-x-1 px-8">
                        <span className="text-[9px] font-bold text-slate-400">{msg.time}</span>
                        {msg.sender === 'patient' && <CheckCircle2 size={10} className="text-blue-500" />}
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/60 border-t border-slate-200/50 backdrop-blur-md">
            <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:border-blue-300 focus-within:shadow-md transition-all">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <Paperclip size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <ImageIcon size={18} />
                </button>
                <input 
                    type="text" 
                    placeholder="Type a secure message..."
                    className="flex-1 bg-transparent border-none outline-none px-2 text-sm font-medium text-slate-700"
                />
                <button className="p-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors">
                    <Send size={18} className="ml-1" />
                </button>
            </div>
            <p className="text-center mt-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-center">
                <CheckCircle2 size={10} className="mr-1 text-emerald-500" />
                End-to-End Encrypted Communication
            </p>
        </div>
      </div>
    </div>
  );
};

export default Messages;
