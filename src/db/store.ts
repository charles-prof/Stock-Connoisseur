// src/db/store.ts
import { openDB } from 'idb';

const DB_NAME = 'StockConnoisseurStore';
const STORE_NAME = 'data';

export const getStore = async () => openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export const saveData = async (data: any) => {
  const db = await getStore();
  await db.put(STORE_NAME, JSON.stringify(data), 'app-state');
};

export const loadData = async (): Promise<any> => {
  const db = await getStore();
  const data = await db.get(STORE_NAME, 'app-state');
  return data ? JSON.parse(data) : { stocks: [], snapshots: {}, events: [] };
};
