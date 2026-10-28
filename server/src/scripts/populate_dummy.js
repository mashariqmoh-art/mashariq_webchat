require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const users = require('../db/user');
const conversations = require('../db/conversations');
const messages = require('../db/messages');

const DEFAULT_PASSWORD = '123456';
const GROUP_NAME = 'Mashariq Group Chat';

const FIRST_NAMES = [
  'Ahmed', 'Sara', 'Omar', 'Lina', 'Khalid', 'Noura', 'Faisal', 'Huda',
  'Tariq', 'Maha', 'Yousef', 'Rana', 'Salem', 'Dalia', 'Bilal', 'Reem',
  'Adel', 'Mona', 'Hassan', 'Laila',
];

const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.',
  'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
  'Ut enim ad minima veniam, quis nostrum exercitationem ullam.',
  'Quis autem vel eum iure reprehenderit qui in ea voluptate velit.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus.',
  'Et harum quidem rerum facilis est et expedita distinctio.',
  'Nam libero tempore, cum soluta nobis est eligendi optio cumque.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum.',
  'Itaque earum rerum hic tenetur a sapiente delectus.',
  'Nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi.',
];

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randomPick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomLorem() {
  const count = randomInt(1, 3);
  const parts = [];
  for (let i = 0; i < count; i += 1) {
    parts.push(randomPick(LOREM_SENTENCES));
  }
  return parts.join(' ');
}

class DummyPopulator {
  run(argv) {
    const count = this.parseCount(argv);
    const dummyUsers = this.createDummyUsers(count);
    const conversationList = this.createConversations(dummyUsers);
    this.fillConversations(conversationList);
    console.log(`\nDone. ${count} dummy users ready — login: user<N>@mashariq.local / ${DEFAULT_PASSWORD}`);
  }

  parseCount(argv) {
    const arg = argv.find((value) => /^\d+$/.test(value));
    const count = arg ? Number(arg) : 0;
    if (count < 1) {
      console.log('Usage: npm run populate -- <num>   (e.g. npm run populate -- 20)');
      process.exit(1);
    }
    return count;
  }

  createDummyUsers(count) {
    const created = [];

    for (let i = 1; i <= count; i += 1) {
      const firstName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
      const data = {
        name: `${firstName} Demo${i}`,
        email: `user${i}@mashariq.local`,
        nickName: `user${i}`,
        mobileNo: `051000${String(i).padStart(4, '0')}`,
        password: DEFAULT_PASSWORD,
      };

      const existing = users.findUserByEmail(data.email) || users.findUserByNickName(data.nickName);
      if (existing) {
        console.log(`skip   ${data.nickName} — already exists (SID ${existing.SID})`);
        created.push(existing);
        continue;
      }

      const user = users.createUser(data);
      console.log(`create ${user.nickName} (${user.name})  SID ${user.SID}`);
      created.push(user);
    }

    return created;
  }

  createConversations(dummyUsers) {
    const conversationList = [];

    for (let i = 0; i < dummyUsers.length; i += 1) {
      const userA = dummyUsers[i];
      const userB = dummyUsers[(i + 1) % dummyUsers.length];
      if (userA.SID === userB.SID) continue;

      const existing = conversations.findDirectConversation(userA.SID, userB.SID);
      if (existing) {
        console.log(`skip   ${userA.nickName}↔${userB.nickName} — already exists (SID ${existing.SID})`);
        continue;
      }

      const conversation = conversations.createConversation({
        creatorSID: userA.SID,
        otherUserSID: userB.SID,
      });
      conversationList.push({ conversation, memberSIDs: [userA.SID, userB.SID] });
      console.log(`create ${userA.nickName}↔${userB.nickName} conversation (SID ${conversation.SID})`);
    }

    if (dummyUsers.length >= 3) {
      const creator = dummyUsers[0];
      const group = conversations.createGroup({
        creatorSID: creator.SID,
        name: GROUP_NAME,
        memberSIDs: dummyUsers.slice(1).map((user) => user.SID),
      });
      conversationList.push({
        conversation: group,
        memberSIDs: dummyUsers.map((user) => user.SID),
      });
      console.log(`create group "${GROUP_NAME}" (SID ${group.SID}, ${dummyUsers.length} members)`);
    }

    return conversationList;
  }

  fillConversations(conversationList) {
    for (const { conversation, memberSIDs } of conversationList) {
      const count = randomInt(8, 20);
      for (let i = 0; i < count; i += 1) {
        messages.createMessage({
          conversationSID: conversation.SID,
          senderSID: randomPick(memberSIDs),
          content: randomLorem(),
        });
      }
      console.log(`fill   conversation ${conversation.SID} with ${count} messages`);
    }
  }
}

new DummyPopulator().run(process.argv.slice(2));
