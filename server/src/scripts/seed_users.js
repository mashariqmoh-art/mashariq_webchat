require('dotenv').config();

const users = require('../db/user');
const conversations = require('../db/conversations');

const SEED_USERS = [
  { name: 'alice', email: 'alice@mashariq.local', nickName: 'alice', mobileNo: '0500000001', password: 'pass1234' },
  { name: 'bob',   email: 'bob@mashariq.local',   nickName: 'bob',   mobileNo: '0500000002', password: 'pass1234' },
  { name: 'carol', email: 'carol@mashariq.local', nickName: 'carol', mobileNo: '0500000003', password: 'pass1234' },
];

class UserSeeder {
  run() {
    const created = {};

    for (const data of SEED_USERS) {
      const existing = users.findUserByEmail(data.email) || users.findUserByNickName(data.nickName);
      if (existing) {
        console.log(`skip   ${data.nickName} — already exists (SID ${existing.SID})`);
        created[data.nickName] = existing;
        continue;
      }

      const user = users.createUser(data);
      console.log(`create ${user.nickName} (SID ${user.SID})  login: ${data.email} / ${data.password}`);
      created[data.nickName] = user;
    }

    this.ensureDirectConversation(created.alice, created.bob);
  }

  ensureDirectConversation(alice, bob) {
    if (!alice || !bob) return;

    const existing = conversations.findDirectConversation(alice.SID, bob.SID);
    if (existing) {
      console.log(`skip   alice↔bob conversation — already exists (SID ${existing.SID})`);
      return;
    }

    const conversation = conversations.createConversation({
      creatorSID: alice.SID,
      otherUserSID: bob.SID,
    });
    console.log(`create alice↔bob conversation (SID ${conversation.SID})`);
  }
}

new UserSeeder().run();
