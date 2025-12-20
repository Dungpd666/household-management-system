// Simple script to test login + list users + delete one user
// Run with: node test-endpoints.js

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function main() {
  try {
    console.log('API_URL =', API_URL);

    // 1. Login as superadmin
    console.log('\n===> LOGIN as superadmin');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'superadmin',
      password: 'superadmin123',
    });

    console.log('Login status:', loginRes.status);
    console.log('Login data:', loginRes.data);

    const token = loginRes.data.accessToken;
    if (!token) {
      console.error('No accessToken returned from login');
      process.exit(1);
    }

    const client = axios.create({
      baseURL: API_URL,
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2. List users before delete
    console.log('\n===> GET /users (before delete)');
    const beforeRes = await client.get('/users');
    console.log('Users count BEFORE:', beforeRes.data.length);
    console.log('Users BEFORE:', beforeRes.data.map((u) => ({ id: u.id, userName: u.userName, role: u.role })));

    if (!beforeRes.data.length) {
      console.log('No users to delete. Exiting.');
      return;
    }

    // Pick the last user in list to delete (avoid deleting first superadmin by accident)
    const target = beforeRes.data[beforeRes.data.length - 1];
    console.log('\n===> DELETE /users/' + target.id, `(${target.userName})`);
    const deleteRes = await client.delete(`/users/${target.id}`);
    console.log('Delete status:', deleteRes.status, 'data:', deleteRes.data);

    // 3. List users after delete
    console.log('\n===> GET /users (after delete)');
    const afterRes = await client.get('/users');
    console.log('Users count AFTER:', afterRes.data.length);
    console.log('Users AFTER:', afterRes.data.map((u) => ({ id: u.id, userName: u.userName, role: u.role })));

    console.log('\nDONE. If count AFTER < BEFORE và không còn thấy user vừa xóa là OK.');
  } catch (err) {
    if (err.response) {
      console.error('\nHTTP ERROR:', err.response.status, err.response.data);
    } else {
      console.error('\nERROR:', err.message || err);
    }
    process.exit(1);
  }
}

main();
