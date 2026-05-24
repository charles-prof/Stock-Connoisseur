// src/components/EditModal.tsx
import { useState } from 'react';

interface EditModalProps {
  symbol: string;
  name: string;
  notes: string;
  reportDate: string;
  onSave: (newSymbol: string, newName: string, newNotes: string, newReportDate: string) => void;
  onClose: () => void;
}

export default function EditModal({ symbol, name, notes, reportDate, onSave, onClose }: EditModalProps) {
  const [editSymbol, setEditSymbol] = useState(symbol);
  const [editName, setEditName] = useState(name);
  const [editNotes, setEditNotes] = useState(notes || '');
  const [editReportDate, setEditReportDate] = useState(reportDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSymbol.trim() && editName.trim()) {
      onSave(editSymbol.trim(), editName.trim(), editNotes.trim(), editReportDate);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Edit Stock Details</h2>
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
          <div className="form-group">
            <label>Next Report Date</label>
            <input 
              type="date"
              value={editReportDate} 
              onChange={e => setEditReportDate(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Performance Notes / Entry-Exit Strategy</label>
            <textarea 
              value={editNotes} 
              onChange={e => setEditNotes(e.target.value)} 
              placeholder="Take notes on performance, entry and exit positions..." 
              rows={4}
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
