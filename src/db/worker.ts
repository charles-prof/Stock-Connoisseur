// src/db/worker.ts
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let db: any;

const initDb = async () => {
  const sqlite3 = await sqlite3InitModule();
  if ('opfs' in sqlite3) {
    db = new sqlite3.oo1.OpfsDb('/stock_connoisseur.db');
  } else {
    db = new sqlite3.oo1.DB('/stock_connoisseur.db', 'ct');
  }
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS stocks (
      symbol TEXT PRIMARY KEY,
      name TEXT,
      market TEXT,
      currency TEXT,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS snapshots (
      symbol TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      price REAL,
      pe_ratio REAL,
      market_cap REAL,
      sma_200 REAL,
      rsi REAL,
      score REAL,
      FOREIGN KEY(symbol) REFERENCES stocks(symbol)
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      symbol TEXT,
      event_type TEXT,
      event_date DATE,
      notified BOOLEAN DEFAULT 0,
      FOREIGN KEY(symbol) REFERENCES stocks(symbol)
    );
  `);
};

self.onmessage = async (e) => {
  const { type, payload, id } = e.data;
  if (type === 'init') {
    await initDb();
    self.postMessage({ type: 'init-complete', id });
  } else if (type === 'query') {
    const result = db.exec(payload, { returnValue: 'resultRows' });
    self.postMessage({ type: 'query-result', payload: result, id });
  }
};
