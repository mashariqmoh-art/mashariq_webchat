const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const jwt = require('jsonwebtoken');
const users = require('../db/user');

class TokenGenerator {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
  }

  parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i++) {
      if (argv[i] === '--email') args.email = argv[++i];
      else if (argv[i] === '--sid') args.sid = Number(argv[++i]);
      else if (argv[i] === '--nick') args.nick = argv[++i];
      else if (argv[i] === '--expires') args.expires = argv[++i];
      else if (!argv[i].startsWith('--')) args.email = args.email || argv[i];
    }
    return args;
  }

  findUser(args) {
    if (args.sid) return users.findUserBySID(args.sid);
    if (args.nick) return users.findUserByNickName(args.nick);
    if (args.email) return users.findUserByEmail(args.email);
    return null;
  }

  run() {
    const args = this.parseArgs(process.argv.slice(2));

    if (!this.jwtSecret) {
      console.error('JWT_SECRET is not set — check server/.env');
      process.exit(1);
    }

    const user = this.findUser(args);
    if (!user) {
      console.error('User not found. Usage: npm run token -- [--email <email> | --sid <SID> | --nick <nickName>] [--expires 7d]');
      process.exit(1);
    }

    const token = jwt.sign(
      { userSID: user.SID, nickName: user.nickName },
      this.jwtSecret,
      { expiresIn: args.expires || '7d' }
    );

    console.log(`user:  ${user.nickName} (SID ${user.SID})`);
    console.log(`token: ${token}`);
    console.log(`url:   http://localhost:5174/?token=${token}`);
  }
}

new TokenGenerator().run();
