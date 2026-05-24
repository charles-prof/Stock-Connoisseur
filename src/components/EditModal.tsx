// src/components/EditModal.tsx
import { useState } from 'react';

interface EditModalProps {
  symbol: string;
  name: string;
  onSave: (newSymbol: string, newName: string) => void;
  onClose: () => void;
}

export default function EditModal({ symbol, name, onSave, onClose }: EditModalProps) {
  const [editSymbol, setEditSymbol] = useState(symbol);
  const [editName, setEditName] = useState(name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSymbol.trim() && editName.trim()) {
      onSave(editSymbol.trim(), editName.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Edit Stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Symbol</label>
            <input 
              value={editSymbol} 
              onChange={e => setEditSymbol(e.target.value)} 
              placeholder="Symbol" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              placeholder="Name" 
              required 
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
