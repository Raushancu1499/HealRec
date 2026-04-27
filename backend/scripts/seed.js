import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@healrec.com',
        password: 'demo123',
        role: 'Patient',
        profile: {
          phone: '(555) 000-0001',
          medicalInfo: {
            bloodType: 'O+',
            allergies: ['Peanuts'],
            conditions: ['None']
          }
        }
      },
      {
        name: 'Dr. Sarah Mitchell',
        email: 'sarah.mitchell@healrec.com',
        password: 'demo123',
        role: 'Doctor',
        profile: {
          phone: '(555) 000-0002'
        }
      },
      {
        name: 'Lab Tech',
        email: 'lab.tech@healrec.com',
        password: 'demo123',
        role: 'Lab',
        profile: {
          phone: '(555) 000-0003'
        }
      },
      {
        name: 'Admin User',
        email: 'admin@healrec.com',
        password: 'demo123',
        role: 'Admin',
        profile: {
          phone: '(555) 000-0004'
        }
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
