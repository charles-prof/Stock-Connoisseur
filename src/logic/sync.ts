// src/logic/sync.ts
import { fetchStockData } from '../api/yfinance';
import { calculateScore } from './intimator';
import { addSnapshot } from '../db/client';

export const syncStock = async (symbol: string) => {
  const data = await fetchStockData(symbol);
  const score = calculateScore(data);
  
  await addSnapshot(symbol, {
    ...data,
    score,
    timestamp: new Date().toISOString()
  });
};
