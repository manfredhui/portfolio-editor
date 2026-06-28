import { useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { getTotalWeight, isPortfolioValid, countUnlinkedBenchmarkSlots, getTotalTilt, collectTiltableNodes } from '../utils/portfolioUtils';
import { fetchTaaSuggestions } from '../services/taaService';
import { TreeNode } from './TreeNode';
import { AddAssetDialog, AddBundleDialog, AddFolderDialog } from './Dialogs';

type RootAddDialog =
  | { kind: 'folder' }
  | { kind: 'asset' }
  | { kind: 'bundle' }
  | { kind: 'abstract-bundle' }
  | null;

export function PortfolioTree() {
  const { portfolio, assetLibrary, addFolder, addAsset, addBundle, addAbstractBundle, allowAbstractAssets, resetTilts, applyTilts } = usePortfolio();
  const [rootDialog, setRootDialog] = useState<RootAddDialog>(null);
  const [taaLoading, setTaaLoading] = useState(false);
  const [taaSignal, setTaaSignal] = useState<'Risk-On' | 'Neutral' | 'Risk-Off' | null>(null);

  if (!portfolio) {
    return (
      <main className="portfolio-tree-panel">
        <div className="empty-state">
          <p className="empty-state-icon">◈</p>
          <h2>No Portfolio Open</h2>
          <p>Click <strong>New</strong> to create a portfolio, or <strong>Load</strong> to open an existing one.</p>
        </div>
      </main>
    );
  }

  const total = getTotalWeight(portfolio.root);
  const valid = isPortfolioValid(portfolio.root);
  const diff = total - 100;
  const unlinkedSlots = countUnlinkedBenchmarkSlots(portfolio.root);
  const totalTilt = getTotalTilt(portfolio.root);
  const tiltBalanced = Math.abs(totalTilt) < 0.05;

  const handleSuggest = async () => {
    const tiltableNodes = collectTiltableNodes(portfolio.root, assetLibrary.assets);
    if (tiltableNodes.length === 0) return;
    setTaaLoading(true);
    try {
      const result = await fetchTaaSuggestions(tiltableNodes);
      setTaaSignal(result.signal);
      applyTilts(result.tilts.map((t) => ({ id: t.id, tilt: t.tilt })));
    } catch (e) {
      console.error('TAA suggest failed:', e);
    } finally {
      setTaaLoading(false);
    }
  };

  const rootId = portfolio.root.id;

  const handleAddFolder = (name: string) => { addFolder(rootId, name); setRootDialog(null); };
  const handleAddAsset = (assetId: string, weight: number) => { addAsset(rootId, assetId, weight); setRootDialog(null); };
  const handleAddBundle = (bundleId: string, weight: number) => { addBundle(rootId, bundleId, weight); setRootDialog(null); };
  const handleAddAbstractBundle = (bundleId: string, weight: number) => { addAbstractBundle(rootId, bundleId, weight); setRootDialog(null); };

  return (
    <main className="portfolio-tree-panel">
      {!valid && (
        <div className="validation-banner">
          Portfolio total is <strong>{total.toFixed(2)}%</strong> —{' '}
          {diff > 0 ? `over by ${diff.toFixed(2)}%` : `under by ${Math.abs(diff).toFixed(2)}%`}.
          Adjust weights to reach 100%.
        </div>
      )}
      {!allowAbstractAssets && unlinkedSlots > 0 && (
        <div className="validation-banner validation-banner-warn">
          {unlinkedSlots} benchmark slot{unlinkedSlots > 1 ? 's' : ''} {unlinkedSlots > 1 ? 'are' : 'is'} not yet linked to a real asset.
          Enable <strong>Allow Benchmark Slots</strong> in the header to allow leaving slots unfilled.
        </div>
      )}

      {/* Root-level add buttons */}
      <div className="root-actions">
        <span className="root-actions-label">Add to root:</span>
        <button className="btn btn-secondary btn-sm" onClick={() => setRootDialog({ kind: 'folder' })}>+ Folder</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setRootDialog({ kind: 'asset' })}>+ Asset</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setRootDialog({ kind: 'bundle' })}>+ Model</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setRootDialog({ kind: 'abstract-bundle' })}>+ Benchmark</button>
        <div className="root-actions-sep" />
        <span className="root-actions-label">TAA Tilts:</span>
        <button className="btn btn-secondary btn-sm" onClick={() => { resetTilts(); setTaaSignal(null); }} title="Reset all tilts to zero">
          ↺ Reset
        </button>
        <button className="btn btn-taa btn-sm" onClick={handleSuggest} disabled={taaLoading} title="Auto-suggest tilts from TAA model">
          {taaLoading ? <span className="taa-spinner" /> : '✦'} Suggest
        </button>
        {taaSignal && (
          <span className={`taa-signal-badge taa-signal-${taaSignal.toLowerCase().replace('-', '')}`}>
            {taaSignal}
          </span>
        )}
      </div>

      {/* Table header */}
      <div className="tree-header">
        <div className="tree-header-name">Name</div>
        <div className="tree-header-type">Type</div>
        <div className="tree-header-weight">Weight</div>
        <div className="tree-header-tilt">Tilt</div>
        <div className="tree-header-eff">Eff.%</div>
        <div className="tree-header-bar">Distribution</div>
        <div className="tree-header-actions">Actions</div>
      </div>

      {/* Tree rows */}
      <div className="tree-body">
        {portfolio.root.children.length === 0 ? (
          <div className="empty-tree-msg">
            Add items using the buttons above or from the Asset Library on the left.
          </div>
        ) : (
          portfolio.root.children.map((child, i) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={0}
              isLast={i === portfolio.root.children.length - 1}
              parentLines={[]}
            />
          ))
        )}
      </div>

      {/* Total row */}
      <div className="tree-footer">
        <div className="tree-footer-label">Total</div>
        <div className={`tree-footer-total ${valid ? 'total-valid' : 'total-invalid'}`}>
          {total.toFixed(2)}%
          {valid ? ' ✓' : ' ✗'}
        </div>
        <div className="tree-footer-tilt-label">Tilt sum</div>
        <div className={`tree-footer-tilt ${tiltBalanced ? 'tilt-sum-ok' : 'tilt-sum-err'}`}>
          {totalTilt > 0 ? '+' : ''}{totalTilt.toFixed(1)}%
          {tiltBalanced ? ' ✓' : ' ✗'}
        </div>
      </div>

      {/* Root-level dialogs */}
      {rootDialog?.kind === 'folder' && (
        <AddFolderDialog onConfirm={handleAddFolder} onClose={() => setRootDialog(null)} />
      )}
      {rootDialog?.kind === 'asset' && (
        <AddAssetDialog
          assets={assetLibrary.assets}
          onConfirm={handleAddAsset}
          onClose={() => setRootDialog(null)}
        />
      )}
      {rootDialog?.kind === 'bundle' && (
        <AddBundleDialog
          bundles={assetLibrary.bundles}
          assets={assetLibrary.assets}
          type="bundle"
          onConfirm={handleAddBundle}
          onClose={() => setRootDialog(null)}
        />
      )}
      {rootDialog?.kind === 'abstract-bundle' && (
        <AddBundleDialog
          bundles={assetLibrary.bundles}
          assets={assetLibrary.assets}
          type="abstract-bundle"
          onConfirm={handleAddAbstractBundle}
          onClose={() => setRootDialog(null)}
        />
      )}
    </main>
  );
}
