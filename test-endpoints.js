const http = require('http');

const API_URL = 'http://localhost:3000';

async function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing all endpoints...\n');

  try {
    // Log helper for debug
    const logResponse = (label, res) => {
      console.log(`   Status: ${res.status}`);
      if (res.status >= 400) {
        console.log(`   Data: ${JSON.stringify(res.data, null, 2)}`);
      } else {
        console.log(`   Data: ${JSON.stringify(res.data, null, 2)}`);
      }
    };
    // 1. POST /household
    console.log('1️⃣  POST /household — Create household');
    const hhRes = await request('POST', '/household', {
      householdCode: 'HH001',
      address: '123 Le Loi',
      ward: 'Ward 1',
      district: 'District 1',
      city: 'HCM',
      householdType: 'Urban',
    });
    console.log(`   Status: ${hhRes.status} - ${JSON.stringify(hhRes.data, null, 2)}\n`);
    const hhId = hhRes.data.id;

    // 2. GET /household
    console.log('2️⃣  GET /household — List all households');
    const hhListRes = await request('GET', '/household');
    console.log(`   Status: ${hhListRes.status} - Found ${hhListRes.data.length || hhListRes.data} households\n`);

    // 3. POST /person
    console.log('3️⃣  POST /person — Create person');
    const uniqueId = String(Math.floor(Math.random() * 100000000)).padStart(9, '0');
    const personRes = await request('POST', '/person', {
      fullName: 'Nguyen Van A',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      gender: 'male',
      identificationNumber: uniqueId,
      relationshipWithHead: 'Head',
      householdId: hhId,
    });
    console.log(`   Status: ${personRes.status} - ${JSON.stringify(personRes.data, null, 2)}\n`);
    const personId = personRes.data.id;

    // 4. GET /person
    console.log('4️⃣  GET /person — List all persons');
    const personListRes = await request('GET', '/person');
    console.log(`   Status: ${personListRes.status} - Found ${personListRes.data.length || personListRes.data} persons\n`);

    // 5. POST /contribution
    console.log('5️⃣  POST /contribution — Create contribution');
    const contRes = await request('POST', '/contribution', {
      type: 'Monthly',
      amount: 100000,
      dueDate: '2025-11-30',
      householdIds: [hhId],
    });
    console.log(`   Status: ${contRes.status} - ${JSON.stringify(contRes.data, null, 2)}\n`);
    const contId = Array.isArray(contRes.data) ? contRes.data[0]?.id : contRes.data?.id;
    console.log(`   Extracted contId: ${contId}\n`);

    // 6. GET /contribution
    console.log('6️⃣  GET /contribution — List all contributions');
    const contListRes = await request('GET', '/contribution');
    console.log(`   Status: ${contListRes.status} - Found ${contListRes.data.length || contListRes.data} contributions\n`);

    // 7. GET /contribution/stats
    console.log('7️⃣  GET /contribution/stats — Get contribution statistics');
    const statsRes = await request('GET', '/contribution/stats');
    console.log(`   Status: ${statsRes.status} - ${JSON.stringify(statsRes.data, null, 2)}\n`);

    // 8. PUT /contribution/:id
    console.log(`8️⃣  PUT /contribution/${contId} — Update contribution`);
    const updateContRes = await request('PUT', `/contribution/${contId}`, {
      amount: 150000,
    });
    console.log(`   Status: ${updateContRes.status} - ${JSON.stringify(updateContRes.data, null, 2)}\n`);

    // 9. PUT /contribution/:id/pay
    console.log(`9️⃣  PUT /contribution/${contId}/pay — Mark contribution as paid`);
    const payRes = await request('PUT', `/contribution/${contId}/pay`, {
      paidAt: new Date().toISOString().split('T')[0],
    });
    console.log(`   Status: ${payRes.status} - ${JSON.stringify(payRes.data, null, 2)}\n`);

    // 10. POST /users
    console.log('🔟 POST /users — Create user');
    const uniqueUsername = 'user' + Math.floor(Math.random() * 100000);
    const uniqueEmail = `${uniqueUsername}@test${Math.floor(Math.random() * 1000)}.com`;
    const uniquePhone = '+84' + String(Math.floor(Math.random() * 900000000) + 100000000); // +84 followed by 9 digits
    const userRes = await request('POST', '/users', {
      fullName: 'Admin User',
      userName: uniqueUsername,
      passWordHash: 'password123',
      email: uniqueEmail,
      phone: uniquePhone,
      role: 'admin',
    });
    console.log(`   Status: ${userRes.status} - ${JSON.stringify(userRes.data, null, 2)}\n`);

    // 11. GET /users
    console.log('1️⃣1️⃣  GET /users — List all users');
    const userListRes = await request('GET', '/users');
    console.log(`   Status: ${userListRes.status} - Found ${userListRes.data.length || userListRes.data} users\n`);

    console.log('✅ All endpoint tests completed!');
  } catch (err) {
    console.error('❌ Error during testing:', err.message);
  }
}

runTests();
