import React, { useRef, useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { getTotalWeight, isPortfolioValid } from '../utils/portfolioUtils';
import { savePortfolio } from '../utils/fileUtils';
import { loadPortfolio as loadPortfolioFile } from '../utils/fileUtils';
import { NewPortfolioDialog } from './Dialogs';

export function Header() {
  const { portfolio, newPortfolio, loadPortfolio, renameNode, allowAbstractAssets, setAllowAbstractAssets } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');

  const total = portfolio ? getTotalWeight(portfolio.root) : 0;
  const valid = portfolio ? isPortfolioValid(portfolio.root) : false;

  const handleNewConfirm = (name: string) => {
    newPortfolio(name);
    setShowNewDialog(false);
  };

  const handleSave = () => {
    if (portfolio) savePortfolio(portfolio);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const p = await loadPortfolioFile(file);
      loadPortfolio(p);
    } catch {
      alert('Failed to load portfolio file.');
    }
    e.target.value = '';
  };

  const startRename = () => {
    if (!portfolio) return;
    setNameValue(portfolio.name);
    setEditingName(true);
  };

  const commitRename = () => {
    if (portfolio && nameValue.trim()) {
      renameNode(portfolio.root.id, nameValue.trim());
      // Update portfolio name via store — we'll handle this inline
      usePortfolio.setState((s) => ({
        portfolio: s.portfolio ? { ...s.portfolio, name: nameValue.trim(), updatedAt: new Date().toISOString() } : null,
      }));
    }
    setEditingName(false);
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-logo">◈</span>
        <span className="header-app-name">Portfolio Editor</span>
      </div>

      <div className="header-center">
        {portfolio ? (
          editingName ? (
            <input
              className="portfolio-name-input"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingName(false); }}
              autoFocus
            />
          ) : (
            <button className="portfolio-name-btn" onClick={startRename} title="Click to rename">
              {portfolio.name}
              <span className="edit-pencil">✎</span>
            </button>
          )
        ) : (
          <span className="portfolio-name-placeholder">No portfolio open</span>
        )}
      </div>

      <div className="header-actions">
        <label className="abstract-toggle" title="When enabled, benchmark slots do not need to be linked to a real asset — the portfolio is valid with unfilled slots">
          <input
            type="checkbox"
            checked={allowAbstractAssets}
            onChange={(e) => setAllowAbstractAssets(e.target.checked)}
          />
          <span className="abstract-toggle-track">
            <span className="abstract-toggle-thumb" />
          </span>
          <span className="abstract-toggle-label">Allow Benchmark Slots</span>
        </label>

        {portfolio && (
          <div className={`weight-badge ${valid ? 'weight-badge-ok' : 'weight-badge-err'}`}>
            {total.toFixed(1)}%
            {valid ? ' ✓' : ' ✗'}
          </div>
        )}
        <button className="btn btn-secondary" onClick={() => setShowNewDialog(true)}>New</button>
        <button className="btn btn-secondary" onClick={handleLoadClick}>Load</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!portfolio}>Save</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {showNewDialog && (
        <NewPortfolioDialog
          onConfirm={handleNewConfirm}
          onClose={() => setShowNewDialog(false)}
        />
      )}
    </header>
  );
}
