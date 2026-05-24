// src/components/Wishlist.tsx
import React, { useState, useEffect } from 'react';
import { query } from '../db/client';
import AddStock from './AddStock';
import StockCard from './StockCard';

export default function Wishlist({ market }: { market: 'US' | 'IN' }) {
  const [stocks, setStocks] = useState<any[]>([]);

  const loadStocks = async () => {
    const result = await query(`SELECT * FROM stocks WHERE market = '${market}'`);
    setStocks(result || []);
  };

  useEffect(() => { loadStocks(); }, [market]);

  return (
    <div className="wishlist">
      <h2>{market} Wishlist</h2>
      <AddStock market={market} onAdd={loadStocks} />
      <div className="stock-list">
        {stocks.length === 0 ? (
          <p>No stocks added yet.</p>
        ) : (
          stocks.map(s => (
            <StockCard key={s[0]} stock={s} onSync={loadStocks} />
          ))
        )}
      </div>
    </div>
  );
}
