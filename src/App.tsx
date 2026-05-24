// src/App.tsx
import React, { useState, useEffect } from 'react';
import { initDb } from './db/client';
import Wishlist from './components/Wishlist';
import './App.css';

function App() {
  const [activeMarket, setActiveMarket] = useState<'US' | 'IN'>('US');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDb().then(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading Database...</div>;

  return (
    <div className="app">
      <header>
        <h1>Stock Connoisseur</h1>
        <div className="tabs">
          <button onClick={() => setActiveMarket('US')} className={activeMarket === 'US' ? 'active' : ''}>US Stocks</button>
          <button onClick={() => setActiveMarket('IN')} className={activeMarket === 'IN' ? 'active' : ''}>Indian Stocks</button>
        </div>
      </header>
      <main>
        <Wishlist market={activeMarket} />
      </main>
    </div>
  );
}

export default App;
