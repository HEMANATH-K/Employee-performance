require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/database');

const createAdminUser = async () => {
  try {
    await mongoose.connect(config.mongoURI, config.options);
    console.log('Connected to MongoDB');

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@raisesmart.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@raisesmart.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createAdminUser(); 