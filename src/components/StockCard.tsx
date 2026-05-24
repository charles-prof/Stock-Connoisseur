// src/components/StockCard.tsx
import React from 'react';
import { syncStock } from '../logic/sync';

export default function StockCard({ stock, onSync }: { stock: any, onSync: () => void }) {
  const handleSync = async () => {
    await syncStock(stock[0]);
    onSync();
  };

  return (
    <div className="stock-card">
      <h3>{stock[0]}</h3>
      <p>{stock[1]}</p>
      <button onClick={handleSync}>Sync Now</button>
    </div>
  );
}
