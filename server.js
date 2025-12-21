import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import uploadRoutes from './backend/routes/upload.js';
import dashboardRoutes from './backend/routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management';

// Connection state tracking
let isMongoConnected = false;

mongoose.connect(MONGODB_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
  })
  .catch((error) => {
    isMongoConnected = false;
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Make sure your MONGODB_URI in .env file is correct');
    console.error('💡 For MongoDB Atlas, format: mongodb+srv://username:password@cluster.mongodb.net/database_name');
  });

// Handle connection events
mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  isMongoConnected = false;
  console.error('❌ MongoDB error:', error);
});

// Add this before your routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    mongodb: {
      connected: isMongoConnected,
      state: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

