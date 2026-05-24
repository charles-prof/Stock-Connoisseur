// src/components/StockCard.tsx
import { useState } from 'react';
import { syncStock } from '../logic/sync';
import { updateStock, deleteStock, updateEvent } from '../db/client';
import EditModal from './EditModal';

export default function StockCard({ stock, onSync }: { stock: any, onSync: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const symbol = stock[0];
  const name = stock[1];
  const currency = stock[3];
  const price = stock[4];
  const score = stock[5];
  const notes = stock[7];
  const reportDate = stock[8];

  const displaySymbol = symbol.split('.')[0];

  const handleSync = async () => {
    try {
      await syncStock(symbol);
      onSync();
    } catch (error) {
      console.error(error);
      alert(`Failed to sync ${symbol}.`);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Delete ${symbol} from wishlist?`)) {
      await deleteStock(symbol);
      onSync();
    }
  };

  const handleSaveEdit = async (newSymbol: string, newName: string, newNotes: string, newReportDate: string) => {
    await updateStock(symbol, { symbol: newSymbol, name: newName, notes: newNotes });
    if (newReportDate) {
      await updateEvent(newSymbol, newReportDate);
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
      
      {notes && <p className="stock-notes">"{notes}"</p>}

      <div className="stock-metrics">
        <div className="metric">
          <span className="label">Price:</span>
          <span className="value">{price ? `${price.toFixed(2)} ${currency}` : '---'}</span>
        </div>
        <div className="metric">
          <span className="label">Score:</span>
          <span className="value score">{score !== null ? `${Math.round(score)}/100` : '---'}</span>
        </div>
        {reportDate && (
          <div className="metric">
            <span className="label">Reports:</span>
            <span className="value date">{reportDate}</span>
          </div>
        )}
      </div>

      <button onClick={handleSync} className="btn-sync">Sync Now</button>

      {isEditOpen && (
        <EditModal 
          symbol={symbol} 
          name={name} 
          notes={notes}
          reportDate={reportDate}
          onSave={handleSaveEdit} 
          onClose={() => setIsEditOpen(false)} 
        />
      )}
    </div>
  );
}
