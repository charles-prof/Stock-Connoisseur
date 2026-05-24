// src/logic/sync.ts
import { fetchStockData } from '../api/yfinance';
import { calculateScore } from './intimator';
import { query } from '../db/client';

export const syncStock = async (symbol: string) => {
  const data = await fetchStockData(symbol);
  const score = calculateScore(data);
  
  await query(`
    INSERT INTO snapshots (symbol, price, pe_ratio, market_cap, sma_200, rsi, score)
    VALUES ('${symbol}', ${data.price}, ${data.peRatio}, ${data.marketCap}, ${data.sma200}, ${data.rsi}, ${score})
  `);
};
