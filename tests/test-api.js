const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let studentToken, adminToken;

async function runTests() {
    console.log('\n════════════════════════════════════════');
    console.log('🧪 STARTING SCMS INTEGRATION TESTS');
    console.log('════════════════════════════════════════\n');

    try {
        // 1. Test Student Registration
        console.log('📝 Test 1: Student Registration');
        const studentReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'CI Test Student',
            email: `student_${Date.now()}@test.com`,
            password: 'test123',
            role: 'student'
        });
        studentToken = studentReg.data.token;
        console.log('   ✅ Student registered successfully\n');

        // 2. Test Admin Registration
        console.log('📝 Test 2: Admin Registration');
        const adminReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'CI Test Admin',
            email: `admin_${Date.now()}@test.com`,
            password: 'admin123',
            role: 'admin'
        });
        adminToken = adminReg.data.token;
        console.log('   ✅ Admin registered successfully\n');

        // 3. Test Student Login
        console.log('🔐 Test 3: Student Login');
        const studentLogin = await axios.post(`${API_URL}/auth/login`, {
            email: studentReg.data.user.email,
            password: 'test123'
        });
        console.log('   ✅ Student login successful\n');

        // 4. Test Student Create Complaint
        console.log('📝 Test 4: Student Create Complaint');
        const complaint = await axios.post(`${API_URL}/complaints`,
            {
                subject: 'CI Test Complaint',
                category: 'Lab Infrastructure',
                description: 'This is an automated test complaint',
                priority: 'High'
            },
            { headers: { Authorization: `Bearer ${studentToken}` } }
        );
        console.log('   ✅ Complaint created successfully\n');

        // 5. Test Admin View All Complaints
        console.log('👑 Test 5: Admin View All Complaints');
        const allComplaints = await axios.get(`${API_URL}/complaints`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`   ✅ Admin can view ${allComplaints.data.length} complaints\n`);

        // 6. Test Admin Dashboard Stats
        console.log('📊 Test 6: Admin Dashboard Stats');
        const stats = await axios.get(`${API_URL}/complaints/stats`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('   ✅ Dashboard stats accessible\n');

        console.log('════════════════════════════════════════');
        console.log('🎉 ALL INTEGRATION TESTS PASSED!');
        console.log('════════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.response?.data || error.message);
        process.exit(1);
    }
}

runTests();