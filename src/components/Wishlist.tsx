// src/components/Wishlist.tsx
import React from 'react';

export default function Wishlist({ market }: { market: 'US' | 'IN' }) {
  return (
    <div>
      <h2>{market} Wishlist</h2>
      <p>Wishlist items will appear here.</p>
    </div>
  );
}
