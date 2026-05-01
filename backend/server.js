import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import healthRoutes from './routes/health.js';
import medicationRoutes from './routes/medications.js';
import appointmentRoutes from './routes/appointments.js';
import reportRoutes from './routes/reports.js';
import telemedicineRoutes from './routes/telemedicine.js';
import emergencyRoutes from './routes/emergency.js';
import familyRoutes from './routes/family.js';
import labRoutes from './routes/lab.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Database connection
import { connectDB } from './config/database.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Connect to database
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // increased for development
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint (renamed to avoid conflict with /api/health routes)
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/telemedicine', telemedicineRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/lab', labRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room`);
  });

  // Handle emergency alerts
  socket.on('emergency-alert', (data) => {
    console.log('Emergency alert received:', data);
    socket.broadcast.emit('emergency-notification', data);
    
    // Notify all connected users in emergency
    io.emit('broadcast-emergency', {
      type: 'emergency',
      message: `Emergency alert from ${data.userName}`,
      location: data.location,
      timestamp: new Date()
    });
  });

  // Handle real-time health updates
  socket.on('health-update', (data) => {
    console.log('Health update received:', data);
    socket.to(`user-${data.userId}`).emit('health-data-update', data);
  });

  // Handle medication reminders
  socket.on('medication-reminder', (data) => {
    console.log('Medication reminder received:', data);
    socket.to(`user-${data.userId}`).emit('reminder-notification', data);
  });

  // Handle appointment updates
  socket.on('appointment-update', (data) => {
    console.log('Appointment update received:', data);
    socket.to(`user-${data.userId}`).emit('appointment-update', data);
  });

  // Handle family activities
  socket.on('family-activity', (data) => {
    console.log('Family activity received:', data);
    socket.to(`user-${data.userId}`).emit('family-activity', data);
  });

  // Handle telemedicine events
  socket.on('telemedicine-event', (data) => {
    console.log('Telemedicine event received:', data);
    socket.to(`user-${data.userId}`).emit('telemedicine-event', data);
  });

  // Handle device sync
  socket.on('device-sync', (data) => {
    console.log('Device sync received:', data);
    socket.to(`user-${data.userId}`).emit('device-sync-complete', data);
  });

  // Handle location updates for emergency
  socket.on('location-update', (data) => {
    console.log('Location update received:', data);
    socket.to(`user-${data.userId}`).emit('location-update', data);
  });

  // Handle general notifications
  socket.on('send-notification', (data) => {
    console.log('Notification request received:', data);
    socket.to(`user-${data.userId}`).emit('notification', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export { app, io };
