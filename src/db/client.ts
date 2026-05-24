// src/db/client.ts
const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

let nextId = 0;
const pendingRequests = new Map();

worker.onmessage = (e) => {
  const { type, payload, id } = e.data;
  if (pendingRequests.has(id)) {
    const { resolve } = pendingRequests.get(id);
    resolve(payload);
    pendingRequests.delete(id);
  }
};

export const initDb = () => {
  return new Promise((resolve) => {
    const id = nextId++;
    pendingRequests.set(id, { resolve });
    worker.postMessage({ type: 'init', id });
  });
};

export const query = (sql: string) => {
  return new Promise((resolve) => {
    const id = nextId++;
    pendingRequests.set(id, { resolve });
    worker.postMessage({ type: 'query', payload: sql, id });
  });
};
