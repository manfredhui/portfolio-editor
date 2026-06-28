import { useEffect, useState } from 'react';
import { Portfolio } from '../types';
import {
  listExamples, loadExample, listSaved, saveToServer, loadFromServer, deleteFromServer,
  ExampleMeta, SavedPortfolioMeta,
} from '../services/portfolioServer';

interface Props {
  currentPortfolio: Portfolio | null;
  onLoad: (p: Portfolio) => void;
  onClose: () => void;
}

type Tab = 'examples' | 'saved';

export function PortfolioLibraryModal({ currentPortfolio, onLoad, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('examples');
  const [examples, setExamples] = useState<ExampleMeta[]>([]);
  const [saved, setSaved] = useState<SavedPortfolioMeta[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    listExamples().then(setExamples).catch(() => setExamples([]));
    refreshSaved();
  }, []);

  const refreshSaved = () => {
    listSaved().then(setSaved).catch(() => setSaved([]));
  };

  const handleLoadExample = async (id: string) => {
    setBusy(id); setError(null);
    try {
      const p = await loadExample(id);
      onLoad(p);
      onClose();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(null);
    }
  };

  const handleLoadSaved = async (id: string) => {
    setBusy(id); setError(null);
    try {
      const p = await loadFromServer(id);
      onLoad(p);
      onClose();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(null);
    }
  };

  const handleSave = async () => {
    if (!currentPortfolio) return;
    setBusy('save'); setError(null); setSaveMsg(null);
    try {
      await saveToServer(currentPortfolio);
      setSaveMsg('Saved!');
      refreshSaved();
      setTab('saved');
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setBusy(id); setError(null);
    try {
      await deleteFromServer(id);
      refreshSaved();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(null);
    }
  };

  const fmt = (iso: string) => iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card lib-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Portfolio Library</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="lib-tabs">
          <button className={`lib-tab${tab === 'examples' ? ' lib-tab-active' : ''}`} onClick={() => setTab('examples')}>
            Examples
          </button>
          <button className={`lib-tab${tab === 'saved' ? ' lib-tab-active' : ''}`} onClick={() => setTab('saved')}>
            Saved{saved.length > 0 ? ` (${saved.length})` : ''}
          </button>
        </div>

        <div className="lib-body">
          {error && <div className="lib-error">{error}</div>}

          {tab === 'examples' && (
            <div className="lib-list">
              {examples.length === 0 && <p className="lib-empty">No examples found.</p>}
              {examples.map((ex) => (
                <div key={ex.id} className="lib-item">
                  <div className="lib-item-info">
                    <span className="lib-item-name">{ex.name}</span>
                    <span className="lib-item-desc">{ex.description}</span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={busy === ex.id}
                    onClick={() => handleLoadExample(ex.id)}
                  >
                    {busy === ex.id ? '…' : 'Load'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'saved' && (
            <>
              <div className="lib-save-row">
                <span className="lib-save-label">
                  {currentPortfolio ? `Save "${currentPortfolio.name}" to server` : 'No portfolio open'}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!currentPortfolio || busy === 'save'}
                  onClick={handleSave}
                >
                  {busy === 'save' ? '…' : '☁ Save'}
                </button>
                {saveMsg && <span className="lib-save-ok">{saveMsg}</span>}
              </div>

              <div className="lib-list">
                {saved.length === 0 && <p className="lib-empty">No saved portfolios yet.</p>}
                {saved.map((s) => (
                  <div key={s.id} className="lib-item">
                    <div className="lib-item-info">
                      <span className="lib-item-name">{s.name}</span>
                      <span className="lib-item-desc">Saved {fmt(s.updatedAt)}</span>
                    </div>
                    <div className="lib-item-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={busy === s.id}
                        onClick={() => handleLoadSaved(s.id)}
                      >
                        {busy === s.id ? '…' : 'Load'}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm lib-delete-btn"
                        disabled={busy === s.id}
                        onClick={() => handleDelete(s.id, s.name)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
