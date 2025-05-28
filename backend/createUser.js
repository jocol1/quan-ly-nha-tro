const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://locly:123@localhost:27017/quanlynhatro?authSource=admin');
    console.log('Connected to MongoDB');
    const hashedPassword = await bcrypt.hash('password', 10);
    console.log('Creating user...');
    await User.create({ username: 'admin', password: hashedPassword });
    console.log('User created: admin/password');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

createUser();