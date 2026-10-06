const fs = require('fs');
const path = require('path');
const SqliteDatabase = require('better-sqlite3');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, '..', '..', 'chat.sqlite');
    const schemaPath = path.join(__dirname, '..', '..', '..', 'DB_Schema', 'schema.sql');

    this.db = new SqliteDatabase(dbPath);
    this.db.pragma('foreign_keys = ON');
    this.db.exec(fs.readFileSync(schemaPath, 'utf8'));
  }

  prepare(sql) {
    return this.db.prepare(sql);
  }
}

module.exports = new Database();
