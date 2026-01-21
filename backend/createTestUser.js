const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if user exists
    const existingUser = await User.findOne({ email: 'test@campus.com' });
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      process.exit(0);
    }

    // Create new user
    const user = await User.create({
      name: 'Test User',
      email: 'test@campus.com',
      password: 'Test123!',
      role: 'student',
      department: 'CSE'
    });

    console.log('User created successfully:', user);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
