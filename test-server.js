const axios = require('axios');

async function testServer() {
  const baseURL = 'https://shunmugam-textiles-backend.onrender.com';
  
  console.log('Testing backend server...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');
    
    // Test root endpoint
    console.log('2. Testing root endpoint...');
    const rootResponse = await axios.get(`${baseURL}/`);
    console.log('✅ Root endpoint passed:', rootResponse.data);
    console.log('');
    
    // Test CORS preflight
    console.log('3. Testing CORS preflight...');
    const corsResponse = await axios.options(`${baseURL}/api/auth/login`, {
      headers: {
        'Origin': 'https://shunmugam-textiles-frontend.onrender.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    console.log('✅ CORS preflight passed');
    console.log('');
    
    // Test login endpoint (should fail with 400 for missing credentials)
    console.log('4. Testing login endpoint...');
    try {
      await axios.post(`${baseURL}/api/auth/login`, {}, {
        headers: {
          'Origin': 'https://shunmugam-textiles-frontend.onrender.com',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Login endpoint accessible (returned expected 400 for missing credentials)');
      } else {
        console.log('❌ Login endpoint error:', error.message);
      }
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testServer();
