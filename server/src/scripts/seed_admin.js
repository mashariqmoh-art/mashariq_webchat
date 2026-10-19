require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const users = require('../db/user');

const ADMIN = {
  name: 'admin',
  email: 'admin@example.com',
  nickName: 'admin',
  mobileNo: '0500000000',
  password: 'admin1234',
};
const ADMIN_ROLE_SID = 1; // 'admin' role seeded by schema.sql

class AdminSeeder {
  run() {
    let user = users.findUserByEmail(ADMIN.email);

    if (user) {
      console.log(`skip   ${ADMIN.email} — already exists (SID ${user.SID})`);
    } else {
      user = users.createUser(ADMIN);
      console.log(`create ${ADMIN.email} (SID ${user.SID})`);
    }

    users.assignRole(user.SID, ADMIN_ROLE_SID);
    console.log(`assign role 'admin' (role_SID ${ADMIN_ROLE_SID}) to SID ${user.SID}`);

    console.log('\nAdmin login:');
    console.log(`  email:    ${ADMIN.email}`);
    console.log(`  password: ${ADMIN.password}`);
  }
}

new AdminSeeder().run();
