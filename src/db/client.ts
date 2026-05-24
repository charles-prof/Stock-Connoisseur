// src/db/client.ts
import { loadData, saveData } from './store';

let state: { stocks: any[], snapshots: Record<string, any[]>, events: any[] } = {
  stocks: [],
  snapshots: {},
  events: []
};

export const initDb = async () => {
  state = await loadData();
};

export const getStocks = () => state.stocks;
export const getEvents = () => state.events;
export const getSnapshots = (symbol: string) => state.snapshots[symbol] || [];

export const addStock = async (stock: any) => {
  state.stocks.push(stock);
  await saveData(state);
};

export const updateStock = async (symbol: string, updates: any) => {
  const idx = state.stocks.findIndex(s => s.symbol === symbol);
  if (idx !== -1) {
    state.stocks[idx] = { ...state.stocks[idx], ...updates };
    await saveData(state);
  }
};

export const deleteStock = async (symbol: string) => {
  state.stocks = state.stocks.filter(s => s.symbol !== symbol);
  delete state.snapshots[symbol];
  state.events = state.events.filter(e => e.symbol !== symbol);
  await saveData(state);
};

export const addSnapshot = async (symbol: string, snapshot: any) => {
  if (!state.snapshots[symbol]) state.snapshots[symbol] = [];
  state.snapshots[symbol].push(snapshot);
  await saveData(state);
};

export const addEvent = async (event: any) => {
  state.events.push(event);
  await saveData(state);
};

export const updateEvent = async (symbol: string, date: string) => {
  const idx = state.events.findIndex(e => e.symbol === symbol);
  if (idx !== -1) {
    state.events[idx].event_date = date;
  } else {
    state.events.push({ symbol, event_type: 'EARNINGS', event_date: date });
  }
  await saveData(state);
};
