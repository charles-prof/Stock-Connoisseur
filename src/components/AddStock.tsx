// src/components/AddStock.tsx
import React, { useState } from 'react';
import { addStock } from '../db/client';

export default function AddStock({ market, onAdd }: { market: string, onAdd: () => void }) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currency = market === 'US' ? 'USD' : 'INR';
    
    let normalizedSymbol = symbol.toUpperCase().trim();
    if (market === 'IN' && !normalizedSymbol.includes('.')) {
      normalizedSymbol += '.NS';
    }

    await addStock({ 
        symbol: normalizedSymbol, 
        name, 
        market, 
        currency, 
        notes: '', 
        added_at: new Date().toISOString() 
    });
    setSymbol('');
    setName('');
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="add-stock-form">
      <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="Symbol (e.g. AAPL)" required />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name (e.g. Apple Inc.)" required />
      <button type="submit">Add Stock</button>
    </form>
  );
}
