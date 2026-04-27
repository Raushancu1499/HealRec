# HealRec - World-Class Healthcare Management Platform

A comprehensive healthcare management system with separate frontend and backend architecture, featuring world-class functionality comparable to Epic MyChart, Teladoc, and MDLIVE.

## 🏗️ Project Structure

```
HealRec/
├── frontend/                 # React.js frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── assets/        # Images, icons, etc.
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Application entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
│
└── backend/                 # Node.js/Express backend API
    ├── config/            # Database and server configuration
    ├── models/            # MongoDB data models
    ├── routes/            # API route handlers
    ├── controllers/       # Business logic controllers
    ├── middleware/        # Custom middleware functions
    ├── services/          # External service integrations
    ├── utils/             # Utility functions
    ├── uploads/           # File upload storage
    ├── package.json       # Backend dependencies
    └── server.js          # Server entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- MongoDB 4.4 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HealRec
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # In backend directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

## 🌟 World-Class Features

### 🏥 Core Healthcare Management
- **Health Tracking** - Real-time metrics, wearable integration, trend analysis
- **Medication Management** - Smart reminders, refill tracking, drug interaction alerts
- **Telemedicine** - Video consultations, doctor discovery, virtual appointments
- **Emergency Services** - SOS functionality, emergency contacts, nearby hospitals
- **Health Insights** - AI-powered recommendations and predictive analytics
- **Family Management** - Caregiver access, member permissions, shared health data

### 🔧 Advanced Features
- **Wearable Device Integration** - Apple Health, Google Fit connectivity
- **AI-Powered Analytics** - Health predictions, personalized recommendations
- **Video Call Interface** - Professional telemedicine experience
- **Emergency Protocols** - Step-by-step emergency response guides
- **Pharmacy Integration** - Nearby pharmacies, prescription refills
- **Family Coordination** - Multi-user health management

### 🎨 Modern UI/UX
- **Glass-morphism Design** - Modern, clean interface
- **Responsive Layout** - Works seamlessly on all devices
- **Smooth Animations** - Framer Motion interactions
- **Real-time Updates** - Live health data synchronization
- **Accessibility** - WCAG compliant design patterns

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Medications
- `GET /api/medications` - Get user medications
- `POST /api/medications` - Add new medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication
- `POST /api/medications/:id/take` - Mark as taken

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Schedule appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Health Tracking
- `GET /api/health/metrics` - Get health metrics
- `POST /api/health/metrics` - Add health data
- `GET /api/health/trends` - Get health trends
- `GET /api/health/predictions` - Get AI predictions

### Telemedicine
- `GET /api/telemedicine/doctors` - Find doctors
- `POST /api/telemedicine/consultations` - Start consultation
- `GET /api/telemedicine/rooms/:id` - Get video room

### Emergency
- `POST /api/emergency/sos` - Trigger emergency alert
- `GET /api/emergency/contacts` - Get emergency contacts
- `GET /api/emergency/hospitals` - Find nearby hospitals

## 🔧 Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast development server and build tool
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Socket.IO** - Real-time communication
- **Multer** - File upload handling

### Security & Features
- **Helmet** - Security headers
- **bcrypt** - Password hashing
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting for API protection
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Account lockout after failed attempts

## 📱 Real-time Features

- Live health data updates
- Real-time medication reminders
- Emergency alert broadcasting
- Video call signaling
- Family member notifications

## 🌐 External Integrations

- **Apple Health** - iOS health data sync
- **Google Fit** - Android health data sync
- **Twilio** - SMS notifications
- **Email Services** - Appointment reminders
- **Payment Gateways** - Telemedicine payments

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/AWS)
```bash
cd backend
npm start
# Configure environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@healrec.com
- Documentation: docs.healrec.com
- Issues: GitHub Issues

---

**HealRec** - Your complete healthcare management solution, built with world-class features and modern technology.
