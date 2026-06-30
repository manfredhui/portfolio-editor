import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { AssetDef, BundleDef } from '../types';

interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function ModalWrapper({ title, onClose, children }: ModalWrapperProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// New Portfolio Dialog
interface NewPortfolioDialogProps {
  onConfirm: (name: string) => void;
  onClose: () => void;
}

export function NewPortfolioDialog({ onConfirm, onClose }: NewPortfolioDialogProps) {
  const [name, setName] = useState('My Portfolio');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.select(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onConfirm(name.trim());
  };

  return (
    <ModalWrapper title="New Portfolio" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Portfolio Name</label>
          <input
            ref={inputRef}
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter portfolio name"
            autoFocus
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Create</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

// Add Folder Dialog
interface AddFolderDialogProps {
  onConfirm: (name: string) => void;
  onClose: () => void;
}

export function AddFolderDialog({ onConfirm, onClose }: AddFolderDialogProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onConfirm(name.trim());
  };

  return (
    <ModalWrapper title="Add Folder" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Folder Name</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Equity, Fixed Income…"
            autoFocus
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Add Folder</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

// Add Asset Dialog
interface AddAssetDialogProps {
  assets: AssetDef[];
  preselectedAssetId?: string;
  onConfirm: (assetId: string, weight: number) => void;
  onClose: () => void;
}

export function AddAssetDialog({ assets, preselectedAssetId, onConfirm, onClose }: AddAssetDialogProps) {
  const allAssets = assets;
  const [selectedId, setSelectedId] = useState(preselectedAssetId ?? assets.find((a) => a.type === 'concrete')?.id ?? '');
  const [weight, setWeight] = useState('10');
  const [search, setSearch] = useState('');

  const q = search.toLowerCase();
  const filteredConcrete = allAssets.filter(
    (a) => a.type === 'concrete' && (a.name.toLowerCase().includes(q) || (a.ticker ?? '').toLowerCase().includes(q))
  );
  const filteredAbstract = allAssets.filter(
    (a) => a.type === 'abstract' && a.name.toLowerCase().includes(q)
  );

  const selectedAsset = allAssets.find((a) => a.id === selectedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (selectedId && !isNaN(w) && w >= 0 && w <= 100) {
      onConfirm(selectedId, w);
    }
  };

  return (
    <ModalWrapper title="Add Asset / Benchmark Slot" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Search</label>
          <input
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ticker…"
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Select</label>
          <div className="asset-select-list">
            {filteredConcrete.length > 0 && (
              <div className="asset-select-group-label">Concrete Assets</div>
            )}
            {filteredConcrete.map((a) => (
              <div
                key={a.id}
                className={`asset-select-item ${selectedId === a.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(a.id)}
              >
                <span className="badge badge-blue">{a.ticker}</span>
                <span className="asset-select-name">{a.name}</span>
                <span className="asset-select-meta">{a.assetClass} · {a.region}</span>
              </div>
            ))}
            {filteredAbstract.length > 0 && (
              <div className="asset-select-group-label">Benchmark Slots</div>
            )}
            {filteredAbstract.map((a) => (
              <div
                key={a.id}
                className={`asset-select-item ${selectedId === a.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(a.id)}
              >
                <span className="badge badge-purple">Benchmark</span>
                <span className="asset-select-name">{a.name}</span>
                <span className="asset-select-meta">{a.assetClass} · {a.region}</span>
              </div>
            ))}
            {filteredConcrete.length === 0 && filteredAbstract.length === 0 && (
              <p className="empty-state-small">No assets match.</p>
            )}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">
            Weight (%)
            {selectedAsset?.type === 'abstract' && (
              <span className="form-label-hint"> — benchmark slot, link a real asset later</span>
            )}
          </label>
          <input
            className="form-input"
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!selectedId}>
            {selectedAsset?.type === 'abstract' ? 'Add Benchmark Slot' : 'Add Asset'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

// Add Bundle Dialog
interface AddBundleDialogProps {
  bundles: BundleDef[];
  assets: AssetDef[];
  type: 'bundle' | 'abstract-bundle';
  preselectedBundleId?: string;
  onConfirm: (bundleId: string, totalWeight: number) => void;
  onClose: () => void;
}

export function AddBundleDialog({ bundles, assets, type, preselectedBundleId, onConfirm, onClose }: AddBundleDialogProps) {
  const filtered = bundles.filter((b) => b.type === type);
  const [selectedId, setSelectedId] = useState(preselectedBundleId ?? filtered[0]?.id ?? '');
  const [weight, setWeight] = useState('20');

  const selectedBundle = filtered.find((b) => b.id === selectedId);
  const totalW = parseFloat(weight) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId && totalW > 0) onConfirm(selectedId, totalW);
  };

  const title = type === 'bundle' ? 'Add Model' : 'Add Benchmark';
  const badgeLabel = type === 'bundle' ? 'Model' : 'Benchmark';

  return (
    <ModalWrapper title={title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{type === 'bundle' ? 'Select Model' : 'Select Benchmark'}</label>
          <div className="asset-select-list">
            {filtered.map((b) => (
              <div
                key={b.id}
                className={`asset-select-item ${selectedId === b.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(b.id)}
              >
                <span className={`badge ${type === 'bundle' ? 'badge-green' : 'badge-orange'}`}>
                  {badgeLabel}
                </span>
                <div>
                  <div className="asset-select-name">{b.name}</div>
                  <div className="asset-select-meta">{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Total Weight (%)</label>
          <input
            className="form-input"
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        {selectedBundle && totalW > 0 && (
          <div className="bundle-preview">
            <div className="bundle-preview-title">Components Preview</div>
            {selectedBundle.components.map((comp) => {
              const asset = assets.find((a) => a.id === comp.assetId);
              const computedW = (totalW * comp.weight) / 100;
              return (
                <div key={comp.assetId} className="bundle-preview-row">
                  <span className="bundle-preview-name">{asset?.name ?? comp.assetId}</span>
                  <span className="bundle-preview-weight">{comp.weight}% → {computedW.toFixed(2)}%</span>
                </div>
              );
            })}
          </div>
        )}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!selectedId || totalW <= 0}>
            Add {type === 'bundle' ? 'Model' : 'Benchmark'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
