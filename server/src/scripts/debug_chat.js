require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const jwt = require('jsonwebtoken');
const { io } = require('socket.io-client');
const users = require('../db/user');
const conversations = require('../db/conversations');

const SERVER_URL = process.env.CHAT_SERVER_URL || `http://localhost:${process.env.PORT || 3001}`;
const EVENT_TIMEOUT_MS = 5000;

const SCRIPT = [
  { from: 'alice', typing: true },
  { from: 'alice', text: 'Hi Bob, are you there?' },
  { from: 'bob', typing: true },
  { from: 'bob', text: 'Hey Alice! Yes — testing the socket chat.' },
  { from: 'alice', text: 'Great, can you see this message in realtime?' },
  { from: 'bob', text: 'Loud and clear. Debug session works.' },
];

class ChatDebugger {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.clients = {};
    this.received = [];
    this.sent = [];
    this.pending = [];
  }

  log(tag, text) {
    const time = new Date().toISOString().slice(11, 23);
    console.log(`[${time}] [${tag}] ${text}`);
  }

  waitFor(check, label) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`timeout waiting for: ${label}`)), EVENT_TIMEOUT_MS);
      this.pending.push({ check, resolve: (v) => { clearTimeout(timeout); resolve(v); } });
    });
  }

  drainPending() {
    this.pending = this.pending.filter((p) => {
      const hit = this.received.find(p.check);
      if (hit) p.resolve(hit);
      return !hit;
    });
  }

  findUser(nickName) {
    const user = users.findUserByNickName(nickName);
    if (!user) {
      console.error(`User "${nickName}" not found — run: npm run seed`);
      process.exit(1);
    }
    return user;
  }

  ensureConversation(alice, bob) {
    const existing = conversations.findDirectConversation(alice.SID, bob.SID);
    if (existing) return existing;

    this.log('setup', 'no direct conversation — creating one');
    return conversations.createConversation({ creatorSID: alice.SID, otherUserSID: bob.SID });
  }

  signToken(user) {
    return jwt.sign({ userSID: user.SID, nickName: user.nickName }, this.jwtSecret, { expiresIn: '1h' });
  }

  connect(user) {
    const socket = io(SERVER_URL, { auth: { token: this.signToken(user) }, transports: ['websocket'] });
    const tag = user.nickName;

    socket.on('connect', () => this.log(tag, `connected (${socket.id})`));
    socket.on('connect_error', (err) => {
      this.log(tag, `connect_error: ${err.message}`);
      if (/ECONNREFUSED|xhr poll error|websocket error/i.test(err.message)) {
        console.error(`\nCannot reach ${SERVER_URL} — start the server first: npm run dev`);
        process.exit(1);
      }
    });
    socket.on('disconnect', (reason) => this.log(tag, `disconnected: ${reason}`));
    socket.on('message', (msg) => {
      this.received.push({ to: tag, msg });
      this.log(tag, `<< message from ${msg.senderNickName}: "${msg.content}"`);
      this.drainPending();
    });
    socket.on('typing', (t) => this.log(tag, `<< typing: ${t.nickName} is typing`));

    this.clients[tag] = { socket, user };
    return new Promise((resolve, reject) => {
      socket.once('connect', resolve);
      socket.once('connect_error', reject);
    });
  }

  emit(socket, event, payload) {
    return new Promise((resolve) => socket.emit(event, payload, resolve));
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async run() {
    if (!this.jwtSecret) {
      console.error('JWT_SECRET is not set — check server/.env');
      process.exit(1);
    }

    const alice = this.findUser('alice');
    const bob = this.findUser('bob');
    const conversation = this.ensureConversation(alice, bob);
    this.log('setup', `alice SID=${alice.SID}  bob SID=${bob.SID}  conversation SID=${conversation.SID}`);

    await Promise.all([this.connect(alice), this.connect(bob)]);

    for (const { socket } of Object.values(this.clients)) {
      const ack = await this.emit(socket, 'join', { conversationSID: conversation.SID });
      this.log('setup', `join ack: ${JSON.stringify(ack)}`);
    }

    for (const step of SCRIPT) {
      const sender = this.clients[step.from];
      const receiver = this.clients[step.from === 'alice' ? 'bob' : 'alice'];

      if (step.typing) {
        sender.socket.emit('typing', { conversationSID: conversation.SID });
        await this.sleep(400);
        continue;
      }

      const expected = this.waitFor(
        (r) => r.to === receiver.user.nickName && r.msg.sender_SID === sender.user.SID && r.msg.content === step.text,
        `${receiver.user.nickName} to receive "${step.text}"`
      );
      const ack = await this.emit(sender.socket, 'message', { conversationSID: conversation.SID, content: step.text });
      this.log(step.from, `>> "${step.text}"  ack: ${JSON.stringify(ack && ack.ok ? { ok: true, SID: ack.message && ack.message.SID } : ack)}`);
      this.sent.push(step.text);
      await expected;
      await this.sleep(300);
    }

    const missing = this.sent.filter(
      (text) => !this.received.some((r) => r.msg.content === text && r.msg.senderNickName !== r.to)
    );

    this.log('summary', `${this.received.length} message event(s) delivered, ${missing.length} missed`);
    if (missing.length) {
      this.log('summary', `MISSED: ${missing.join(' | ')}`);
      process.exitCode = 1;
    } else {
      this.log('summary', 'PASS — all messages delivered in realtime');
    }

    for (const { socket } of Object.values(this.clients)) socket.disconnect();
    process.exit(process.exitCode || 0);
  }
}

new ChatDebugger().run().catch((err) => {
  console.error(`debug_chat failed: ${err.message}`);
  process.exit(1);
});
