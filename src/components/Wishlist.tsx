// src/components/Wishlist.tsx
import { useState, useEffect } from 'react';
import { getStocks, getSnapshots, getEvents } from '../db/client';
import AddStock from './AddStock';
import StockCard from './StockCard';

export default function Wishlist({ market }: { market: 'US' | 'IN' }) {
  const [stocks, setStocks] = useState<any[]>([]);

  const loadStocks = () => {
    const allStocks = getStocks();
    const allEvents = getEvents();
    
    const formatted = allStocks.filter(s => s.market === market).map(s => {
      const snapshots = getSnapshots(s.symbol);
      const latest = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
      const event = allEvents.find(e => e.symbol === s.symbol);
      
      return [
        s.symbol,
        s.name,
        s.market,
        s.currency,
        latest?.price || null,
        latest?.score || null,
        latest?.timestamp || null,
        s.notes,
        event?.event_date || null
      ];
    });
    setStocks(formatted);
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
