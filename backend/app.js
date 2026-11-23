const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.json({
    service: 'Employee Management API',
    endpoints: {
      health: '/api/health',
      employees: '/api/employees',
    },
  });
});
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});
app.use('/api/employees', employeeRoutes);

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected',
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

app.use(errorMiddleware);

module.exports = app;
