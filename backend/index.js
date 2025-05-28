const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const roomRoutes = require('./routes/room');
const tenantRoutes = require('./routes/tenant');
const authRoutes = require('./routes/auth');
const billRoutes = require('./routes/bill');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bill', billRoutes);


mongoose.connect('mongodb://locly:123@localhost:27017/quanlynhatro?authSource=admin')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(5000, () => console.log('Server running on port 5000'));