// src/components/StockCard.tsx
import { useState } from 'react';
import { syncStock } from '../logic/sync';
import { query } from '../db/client';
import EditModal from './EditModal';

export default function StockCard({ stock, onSync }: { stock: any, onSync: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const symbol = stock[0];
  const name = stock[1];
  const currency = stock[3];
  const price = stock[4];
  const score = stock[5];

  // Hide common market suffixes for display
  const displaySymbol = symbol.split('.')[0];

  const handleSync = async () => {
    try {
      await syncStock(symbol);
      onSync();
    } catch (error) {
      console.error(error);
      alert(`Failed to sync ${symbol}. Ensure the ticker is correct (e.g. RELIANCE.NS for Indian stocks).`);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Delete ${symbol} from wishlist?`)) {
      await query(`DELETE FROM snapshots WHERE symbol = '${symbol}'`);
      await query(`DELETE FROM events WHERE symbol = '${symbol}'`);
      await query(`DELETE FROM stocks WHERE symbol = '${symbol}'`);
      onSync();
    }
  };

  const handleSaveEdit = async (newSymbol: string, newName: string) => {
    if (newSymbol !== symbol || newName !== name) {
      // If symbol changed, we need to update related tables due to FK (or just let user know)
      // For simplicity in MVP, we update the main table. If symbol changes, historical snapshots
      // stay linked if the DB has ON UPDATE CASCADE, otherwise they might drift.
      // Our DDL didn't specify CASCADE, so let's handle it manually or stick to name-only for now
      // Actually, let's just update the stocks table for now as a name change is safest.
      // If the user wants to change the symbol, it's basically a new stock.
      await query(`UPDATE stocks SET symbol = '${newSymbol}', name = '${newName}' WHERE symbol = '${symbol}'`);
      // Update snapshots too to keep them linked
      await query(`UPDATE snapshots SET symbol = '${newSymbol}' WHERE symbol = '${symbol}'`);
      await query(`UPDATE events SET symbol = '${newSymbol}' WHERE symbol = '${symbol}'`);
    }
    setIsEditOpen(false);
    onSync();
  };

  return (
    <div className="stock-card">
      <div className="stock-header">
        <h3>{displaySymbol}</h3>
        <div className="stock-actions">
          <button onClick={() => setIsEditOpen(true)} className="btn-icon" title="Edit">✎</button>
          <button onClick={handleDelete} className="btn-icon btn-danger" title="Delete">✕</button>
        </div>
      </div>
      <p className="stock-name">{name}</p>
      
      <div className="stock-metrics">
        <div className="metric">
          <span className="label">Price:</span>
          <span className="value">{price ? `${price.toFixed(2)} ${currency}` : '---'}</span>
        </div>
        <div className="metric">
          <span className="label">Score:</span>
          <span className="value score">{score !== null ? `${Math.round(score)}/100` : '---'}</span>
        </div>
      </div>

      <button onClick={handleSync} className="btn-sync">Sync Now</button>

      {isEditOpen && (
        <EditModal 
          symbol={symbol} 
          name={name} 
          onSave={handleSaveEdit} 
          onClose={() => setIsEditOpen(false)} 
        />
      )}
    </div>
  );
}
