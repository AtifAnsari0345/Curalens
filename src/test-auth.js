import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

async function testAuth() {
  try {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    // Test registration
    console.log('1. Testing registration...');
    const registerResponse = await axios.post(`${API_URL}/register`, testUser);
    console.log('✅ Registration successful:', registerResponse.data);

    // Test login
    console.log('2. Testing login...');
    const loginResponse = await axios.post(`${API_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data);

    // Test token validation
    console.log('3. Testing token validation...');
    const validateResponse = await axios.get(`${API_URL}/validate`, {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`
      }
    });
    console.log('✅ Token validation successful:', validateResponse.data);

    console.log('🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();