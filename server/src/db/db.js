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
    this.ensureUserProfileColumns();
  }

  ensureUserProfileColumns() {
    const columns = new Set(
      this.db.prepare('PRAGMA table_info(table_User)').all().map((column) => column.name)
    );

    if (!columns.has('profilePicturePath')) {
      this.db.exec('ALTER TABLE table_User ADD COLUMN profilePicturePath TEXT');
    }
    if (!columns.has('status')) {
      this.db.exec('ALTER TABLE table_User ADD COLUMN status TEXT');
    }
  }

  prepare(sql) {
    return this.db.prepare(sql);
  }

  transaction(work) {
    return this.db.transaction(work);
  }
}

module.exports = new Database();
