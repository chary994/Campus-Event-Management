const axios = require('axios');

async function testLogin() {
  try {
    console.log('Attempting login...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@campus.com',
      password: 'Test123!'
    });

    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', JSON.stringify(response.data.user, null, 2));
    process.exit(0);
  } catch (error) {
    console.log('Caught error');
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response from server:', error.message);
    } else {
      console.log('Error:', error.message);
      console.log('Stack:', error.stack);
    }
    process.exit(1);
  }
}

testLogin();
