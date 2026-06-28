import { useState } from 'react';
import { PortfolioNode } from '../types';
import { usePortfolio } from '../hooks/usePortfolio';
import { useExposurePanel } from '../hooks/useExposurePanel';
import { computeEffectiveWeight, computeFolderWeight, computeNodeTilt } from '../utils/portfolioUtils';
import { AddAssetDialog, AddBundleDialog, AddFolderDialog } from './Dialogs';

type AddChildDialog =
  | { kind: 'folder' }
  | { kind: 'asset' }
  | { kind: 'bundle' }
  | { kind: 'abstract-bundle' }
  | null;

interface TreeNodeProps {
  node: PortfolioNode;
  depth: number;
  isLast: boolean;
  parentLines: boolean[];
  isBundleChild?: boolean;
}

const NODE_TYPE_LABELS: Record<string, string> = {
  folder: 'Folder',
  asset: 'Asset',
  bundle: 'Model',
  'abstract-bundle': 'Benchmark',
  'abstract-asset': 'Benchmark',
};

const NODE_TYPE_BADGE: Record<string, string> = {
  folder: 'badge-gray',
  asset: 'badge-blue',
  bundle: 'badge-green',
  'abstract-bundle': 'badge-orange',
  'abstract-asset': 'badge-purple',
};

export function TreeNode({ node, depth, isLast, parentLines, isBundleChild = false }: TreeNodeProps) {
  const {
    assetLibrary,
    portfolio,
    addFolder,
    addAsset,
    addBundle,
    addAbstractBundle,
    updateWeight,
    updateTilt,
    linkAbstractAsset,
    removeNode,
    toggleCollapse,
    renameNode,
    allowAbstractAssets,
  } = usePortfolio();
  const { open: openExposure } = useExposurePanel();

  const [addDialog, setAddDialog] = useState<AddChildDialog>(null);
  const [editingWeight, setEditingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [editingTilt, setEditingTilt] = useState(false);
  const [tiltInput, setTiltInput] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const isFolder = node.nodeType === 'folder';
  const isBundle = node.nodeType === 'bundle' || node.nodeType === 'abstract-bundle';
  const isAbstractAsset = node.nodeType === 'abstract-asset';
  const hasChildren = node.children.length > 0;
  const isCollapsed = node.collapsed ?? false;
  const isRoot = portfolio?.root.id === node.id;

  const effectiveWeight = isFolder ? computeFolderWeight(node) : computeEffectiveWeight(node);
  const nodeTilt = computeNodeTilt(node);

  const concreteAssets = assetLibrary.assets.filter((a) => a.type === 'concrete');
  const linkedAsset = isAbstractAsset && node.linkedAssetId
    ? assetLibrary.assets.find((a) => a.id === node.linkedAssetId)
    : null;

  const handleAddConfirmFolder = (name: string) => { addFolder(node.id, name); setAddDialog(null); };
  const handleAddConfirmAsset = (assetId: string, weight: number) => { addAsset(node.id, assetId, weight); setAddDialog(null); };
  const handleAddConfirmBundle = (bundleId: string, weight: number) => { addBundle(node.id, bundleId, weight); setAddDialog(null); };
  const handleAddConfirmAbstractBundle = (bundleId: string, weight: number) => { addAbstractBundle(node.id, bundleId, weight); setAddDialog(null); };

  const startEditWeight = () => {
    setWeightInput(isNaN(node.weight) ? '0' : String(node.weight));
    setEditingWeight(true);
  };
  const commitWeight = () => {
    const w = parseFloat(weightInput);
    if (!isNaN(w)) updateWeight(node.id, Math.min(100, Math.max(0, w)));
    setEditingWeight(false);
  };

  const startEditName = () => { setNameInput(node.name); setEditingName(true); };
  const commitName = () => { if (nameInput.trim()) renameNode(node.id, nameInput.trim()); setEditingName(false); };

  const indentPx = depth * 24;

  const renderWeightCell = () => {
    if (isFolder) {
      return <span className="tree-weight-computed">{effectiveWeight.toFixed(2)}%</span>;
    }
    if (isBundleChild) {
      return (
        <span className="tree-weight-computed">
          <span className="lock-icon" title="Computed from bundle weight">🔒</span>
          {' '}{effectiveWeight.toFixed(2)}%
        </span>
      );
    }
    if (editingWeight) {
      return (
        <input
          className="weight-input"
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={weightInput}
          onChange={(e) => setWeightInput(e.target.value)}
          onBlur={commitWeight}
          onKeyDown={(e) => { if (e.key === 'Enter') commitWeight(); if (e.key === 'Escape') setEditingWeight(false); }}
          autoFocus
        />
      );
    }
    return (
      <button className="tree-weight-btn" onClick={startEditWeight} title="Click to edit weight">
        {isNaN(node.weight) ? '—' : node.weight.toFixed(2) + '%'}
      </button>
    );
  };

  const startEditTilt = () => { setTiltInput(String(node.tilt ?? 0)); setEditingTilt(true); };
  const commitTilt = () => {
    const t = parseFloat(tiltInput);
    if (!isNaN(t)) updateTilt(node.id, Math.min(50, Math.max(-50, t)));
    setEditingTilt(false);
  };
  const formatTilt = (t: number) => t === 0 ? '—' : (t > 0 ? '+' : '') + t.toFixed(1) + '%';

  const renderTiltCell = () => {
    if (isBundleChild) return <span className="tilt-dash">—</span>;
    if (isFolder) {
      return <span className={`tilt-val${nodeTilt > 0 ? ' tilt-pos' : nodeTilt < 0 ? ' tilt-neg' : ' tilt-zero'}`}>{formatTilt(nodeTilt)}</span>;
    }
    if (editingTilt) {
      return (
        <input
          className="tilt-input"
          type="number"
          step={0.1}
          value={tiltInput}
          onChange={(e) => setTiltInput(e.target.value)}
          onBlur={commitTilt}
          onKeyDown={(e) => { if (e.key === 'Enter') commitTilt(); if (e.key === 'Escape') setEditingTilt(false); }}
          autoFocus
        />
      );
    }
    const t = node.tilt ?? 0;
    return (
      <button
        className={`tilt-btn${t > 0 ? ' tilt-pos' : t < 0 ? ' tilt-neg' : ' tilt-zero'}`}
        onClick={startEditTilt}
        title="Click to edit tilt"
      >
        {formatTilt(t)}
      </button>
    );
  };

  return (
    <>
      <div className={`tree-row${isFolder ? ' tree-row-folder' : ''}${isBundleChild ? ' tree-row-bundle-child' : ''}`}>
        {/* Indent */}
        <div className="tree-indent" style={{ width: indentPx, minWidth: indentPx, position: 'relative', flexShrink: 0 }}>
          {parentLines.map((show, i) =>
            show ? <div key={i} className="tree-vline" style={{ left: i * 24 + 10 }} /> : null
          )}
          {depth > 0 && (
            <>
              <div
                className="tree-vline-partial"
                style={{ left: (depth - 1) * 24 + 10, height: isLast ? '50%' : '100%' }}
              />
              <div className="tree-hline" style={{ left: (depth - 1) * 24 + 10, width: 14 }} />
            </>
          )}
        </div>

        {/* Expand toggle */}
        <div className="tree-toggle">
          {hasChildren ? (
            <button className="tree-toggle-btn" onClick={() => toggleCollapse(node.id)}>
              {isCollapsed ? '▶' : '▼'}
            </button>
          ) : (
            <span className="tree-toggle-dot">·</span>
          )}
        </div>

        {/* Name */}
        <div className="tree-name">
          {editingName ? (
            <input
              className="tree-name-input"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') setEditingName(false); }}
              autoFocus
            />
          ) : (
            <span
              className={`tree-name-text${isFolder ? ' tree-name-folder' : ''}${isBundleChild ? ' text-muted' : ''}`}
              onDoubleClick={!isBundleChild ? startEditName : undefined}
              title={!isBundleChild ? 'Double-click to rename' : undefined}
            >
              {node.name}
            </span>
          )}
          {isAbstractAsset && !allowAbstractAssets && (
            <>
              <select
                className={`link-asset-select${!node.linkedAssetId ? ' link-asset-select-warn' : ''}`}
                value={node.linkedAssetId ?? ''}
                onChange={(e) => linkAbstractAsset(node.id, e.target.value)}
              >
                <option value="">— Link asset —</option>
                {concreteAssets.map((a) => (
                  <option key={a.id} value={a.id}>{a.ticker} – {a.name}</option>
                ))}
              </select>
              {!node.linkedAssetId && (
                <span className="unlinked-warn" title="Benchmark slot must be linked to a real asset">⚠</span>
              )}
            </>
          )}
          {linkedAsset && <span className="linked-asset-tag">→ {linkedAsset.ticker}</span>}
        </div>

        {/* Type badge */}
        <div className="tree-type">
          <span className={`badge ${NODE_TYPE_BADGE[node.nodeType]}`}>
            {NODE_TYPE_LABELS[node.nodeType]}
          </span>
        </div>

        {/* Weight */}
        <div className="tree-weight">
          {renderWeightCell()}
        </div>

        {/* Tilt */}
        <div className="tree-tilt">
          {renderTiltCell()}
        </div>

        {/* Effective % */}
        <div className="tree-eff">
          <span className={`tree-eff-val${isFolder || isBundleChild ? ' text-muted' : ''}`}>
            {effectiveWeight.toFixed(2)}%
          </span>
        </div>

        {/* Weight bar */}
        <div className="tree-bar-col">
          <div className="tree-bar-track">
            <div
              className={`tree-bar-fill${isFolder ? ' bar-folder' : isBundle ? ' bar-bundle' : isBundleChild ? ' bar-bundle-child' : ' bar-asset'}`}
              style={{ width: `${Math.min(100, effectiveWeight)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="tree-actions">
          {isFolder && (
            <>
              <button className="action-btn" title="Add folder" onClick={() => setAddDialog({ kind: 'folder' })}>
                <span>📁</span>
              </button>
              <button className="action-btn" title="Add asset" onClick={() => setAddDialog({ kind: 'asset' })}>
                ＋A
              </button>
              <button className="action-btn" title="Add model" onClick={() => setAddDialog({ kind: 'bundle' })}>
                ＋M
              </button>
              <button className="action-btn" title="Add benchmark" onClick={() => setAddDialog({ kind: 'abstract-bundle' })}>
                ＋BM
              </button>
            </>
          )}
          {(node.nodeType === 'asset' || (node.nodeType === 'abstract-asset' && node.linkedAssetId)) && node.assetId && (
            <button
              className="action-btn action-exposure"
              title="View exposure data"
              onClick={() => openExposure(node.nodeType === 'abstract-asset' && node.linkedAssetId ? node.linkedAssetId : node.assetId!)}
            >
              📊
            </button>
          )}
          {!isRoot && !isBundleChild && (
            <button
              className="action-btn action-delete"
              title="Remove node"
              onClick={() => { if (window.confirm(`Remove "${node.name}"?`)) removeNode(node.id); }}
            >
              🗑
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {!isCollapsed && hasChildren && node.children.map((child, i) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          isLast={i === node.children.length - 1}
          parentLines={[...parentLines, !isLast]}
          isBundleChild={isBundle}
        />
      ))}

      {/* Dialogs */}
      {addDialog?.kind === 'folder' && (
        <AddFolderDialog onConfirm={handleAddConfirmFolder} onClose={() => setAddDialog(null)} />
      )}
      {addDialog?.kind === 'asset' && (
        <AddAssetDialog
          assets={assetLibrary.assets}
          onConfirm={handleAddConfirmAsset}
          onClose={() => setAddDialog(null)}
        />
      )}
      {addDialog?.kind === 'bundle' && (
        <AddBundleDialog
          bundles={assetLibrary.bundles}
          assets={assetLibrary.assets}
          type="bundle"
          onConfirm={handleAddConfirmBundle}
          onClose={() => setAddDialog(null)}
        />
      )}
      {addDialog?.kind === 'abstract-bundle' && (
        <AddBundleDialog
          bundles={assetLibrary.bundles}
          assets={assetLibrary.assets}
          type="abstract-bundle"
          onConfirm={handleAddConfirmAbstractBundle}
          onClose={() => setAddDialog(null)}
        />
      )}
    </>
  );
}
