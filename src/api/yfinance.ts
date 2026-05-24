// src/api/yfinance.ts
const PROXY_URL = 'https://corsproxy.io/?';

export interface StockData {
  price: number;
  peRatio: number;
  marketCap: number;
  sma200: number;
  rsi: number;
}

export const fetchStockData = async (symbol: string): Promise<StockData> => {
  const url = `${PROXY_URL}https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`;
  const response = await fetch(url);
  const data = await response.json();
  const result = data.chart.result[0];
  const adjClose = result.indicators.adjclose[0].adjclose;
  
  // Basic technicals (Simplified for MVP)
  const price = adjClose[adjClose.length - 1];
  const sma200 = adjClose.slice(-200).reduce((a: number, b: number) => a + b, 0) / 200;
  
  // RSI calculation (Simplified)
  const changes = adjClose.slice(-15).map((v: number, i: number, arr: number[]) => i === 0 ? 0 : v - arr[i-1]).slice(1);
  const gains = changes.filter((c: number) => c > 0).reduce((a: number, b: number) => a + b, 0) / 14;
  const losses = Math.abs(changes.filter((c: number) => c < 0).reduce((a: number, b: number) => a + b, 0)) / 14;
  const rs = gains / (losses || 1);
  const rsi = 100 - (100 / (1 + rs));

  // Fundamentals would normally come from a different endpoint or deeper in this response
  // For MVP, we'll focus on price and technicals first.
  return {
    price,
    peRatio: 0, // Need quoteSummary for this
    marketCap: 0,
    sma200,
    rsi
  };
};
