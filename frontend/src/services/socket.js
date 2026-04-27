import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.socket.connected) {
      return;
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token: token
      }
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to real-time server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Disconnected from real-time server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('health-data-update', (data) => {
      this.handleHealthUpdate(data);
    });

    this.socket.on('reminder-notification', (data) => {
      this.handleMedicationReminder(data);
    });

    this.socket.on('emergency-notification', (data) => {
      this.handleEmergencyAlert(data);
    });

    this.socket.on('appointment-update', (data) => {
      this.handleAppointmentUpdate(data);
    });

    this.socket.on('family-activity', (data) => {
      this.handleFamilyActivity(data);
    });

    this.socket.on('telemedicine-event', (data) => {
      this.handleTelemedicineEvent(data);
    });
  }

  joinUserRoom(userId) {
    if (this.socket && userId) {
      this.socket.emit('join-user-room', userId);
    }
  }

  leaveUserRoom(userId) {
    if (this.socket && userId) {
      this.socket.emit('leave-user-room', userId);
    }
  }

  emitHealthData(data) {
    if (this.socket) {
      this.socket.emit('health-update', data);
    }
  }

  handleHealthUpdate(data) {
    const event = new CustomEvent('healthUpdate', { detail: data });
    window.dispatchEvent(event);
  }

  emitMedicationTaken(medicationId) {
    if (this.socket) {
      this.socket.emit('medication-taken', { medicationId, timestamp: new Date() });
    }
  }

  handleMedicationReminder(data) {
    const event = new CustomEvent('medicationReminder', { detail: data });
    window.dispatchEvent(event);
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Medication Reminder', {
        body: data.message,
        icon: '/favicon.ico'
      });
    }
  }

  emitEmergencyAlert(data) {
    if (this.socket) {
      this.socket.emit('emergency-alert', data);
    }
  }

  handleEmergencyAlert(data) {
    const event = new CustomEvent('emergencyAlert', { detail: data });
    window.dispatchEvent(event);
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('EMERGENCY ALERT', {
        body: data.message,
        icon: '/favicon.ico',
        requireInteraction: false
      });
    }
  }

  emitAppointmentUpdate(appointmentId, status) {
    if (this.socket) {
      this.socket.emit('appointment-update', { appointmentId, status, timestamp: new Date() });
    }
  }

  handleAppointmentUpdate(data) {
    const event = new CustomEvent('appointmentUpdate', { detail: data });
    window.dispatchEvent(event);
  }

  emitFamilyActivity(activity) {
    if (this.socket) {
      this.socket.emit('family-activity', activity);
    }
  }

  handleFamilyActivity(data) {
    const event = new CustomEvent('familyActivity', { detail: data });
    window.dispatchEvent(event);
  }

  emitTelemedicineEvent(eventName, data) {
    if (this.socket) {
      this.socket.emit('telemedicine-event', { event: eventName, data, timestamp: new Date() });
    }
  }

  handleTelemedicineEvent(data) {
    const event = new CustomEvent('telemedicineEvent', { detail: data });
    window.dispatchEvent(event);
  }

  emitNotification(notification) {
    if (this.socket) {
      this.socket.emit('send-notification', notification);
    }
  }

  emitLocationUpdate(location) {
    if (this.socket) {
      this.socket.emit('location-update', location);
    }
  }

  emitDeviceSync(deviceData) {
    if (this.socket) {
      this.socket.emit('device-sync', deviceData);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socket: this.socket
    };
  }
}

const socketService = new SocketService();

export default socketService;
