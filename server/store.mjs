import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';

export class Store {
  constructor(path = ':memory:') {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(path);
    if (path !== ':memory:') chmodSync(path, 0o600);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
      CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, csrf TEXT NOT NULL, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS quotes (id TEXT PRIMARY KEY, session TEXT NOT NULL, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS reservations (id TEXT PRIMARY KEY, session TEXT NOT NULL, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS signatures (signature TEXT PRIMARY KEY, reservation TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS outbox (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    `);
  }
  get(table, id) { const row = this.db.prepare(`SELECT data FROM ${this.table(table)} WHERE id=?`).get(id); return row && JSON.parse(row.data); }
  put(table, id, value, session) {
    table = this.table(table);
    if (['quotes', 'reservations'].includes(table)) this.db.prepare(`INSERT INTO ${table}(id,session,data) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data`).run(id, session, JSON.stringify(value));
    else this.db.prepare(`INSERT INTO ${table}(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data`).run(id, JSON.stringify(value));
  }
  table(t) { if (!['quotes', 'reservations', 'outbox'].includes(t)) throw Error('Invalid table'); return t; }
  allReservations() { return this.db.prepare('SELECT data FROM reservations ORDER BY rowid DESC').all().map(r => JSON.parse(r.data)); }
  session(id) { return this.db.prepare('SELECT * FROM sessions WHERE id=?').get(id); }
  createSession(id, csrf, data) { this.db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(id, csrf, JSON.stringify(data)); }
  saveSession(id, data) { this.db.prepare('UPDATE sessions SET data=? WHERE id=?').run(JSON.stringify(data), id); }
  recordSignature(signature, reservation) { this.db.prepare('INSERT INTO signatures VALUES(?,?)').run(signature, reservation); }
  signatureUsed(signature) { return this.db.prepare('SELECT reservation FROM signatures WHERE signature=?').get(signature); }
  tx(fn) { this.db.exec('BEGIN IMMEDIATE'); try { const result = fn(); this.db.exec('COMMIT'); return result; } catch(e) { this.db.exec('ROLLBACK'); throw e; } }
  close() { this.db.close(); }
}
