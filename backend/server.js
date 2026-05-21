require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// ============================================
// HEALTH CHECK ENDPOINT (ADD THIS)
// ============================================
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: states[dbState],
    server: 'running',
    uptime: process.uptime()
  });
});

// ============================================
// YOUR EXISTING ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});