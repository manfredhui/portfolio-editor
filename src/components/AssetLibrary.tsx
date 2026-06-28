import { useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { AssetDef, BundleDef } from '../types';
import { AddAssetDialog, AddBundleDialog } from './Dialogs';

type LibraryDialog =
  | { kind: 'asset'; assetId: string }
  | { kind: 'bundle'; bundleId: string; type: 'bundle' | 'abstract-bundle' }
  | null;

export function AssetLibrary() {
  const { assetLibrary, portfolio, addAsset, addBundle, addAbstractBundle } = usePortfolio();
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<LibraryDialog>(null);

  const rootId = portfolio?.root.id ?? '';

  const concreteAssets = assetLibrary.assets.filter(
    (a) =>
      a.type === 'concrete' &&
      (a.name.toLowerCase().includes(search.toLowerCase()) ||
        (a.ticker ?? '').toLowerCase().includes(search.toLowerCase()))
  );
  const abstractAssets = assetLibrary.assets.filter(
    (a) =>
      a.type === 'abstract' &&
      a.name.toLowerCase().includes(search.toLowerCase())
  );
  const concreteBundles = assetLibrary.bundles.filter(
    (b) =>
      b.type === 'bundle' &&
      b.name.toLowerCase().includes(search.toLowerCase())
  );
  const abstractBundles = assetLibrary.bundles.filter(
    (b) =>
      b.type === 'abstract-bundle' &&
      b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddAsset = (assetId: string, weight: number) => {
    addAsset(rootId, assetId, weight);
    setDialog(null);
  };

  const handleAddBundle = (bundleId: string, weight: number) => {
    addBundle(rootId, bundleId, weight);
    setDialog(null);
  };

  const handleAddAbstractBundle = (bundleId: string, weight: number) => {
    addAbstractBundle(rootId, bundleId, weight);
    setDialog(null);
  };

  return (
    <aside className="asset-library">
      <div className="library-header">
        <h3 className="library-title">Asset Library</h3>
        <input
          className="library-search"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="library-content">
        <LibrarySection title="Concrete Assets" isEmpty={concreteAssets.length === 0}>
          {concreteAssets.map((a) => (
            <AssetItem
              key={a.id}
              asset={a}
              onAdd={() => setDialog({ kind: 'asset', assetId: a.id })}
              disabled={!portfolio}
            />
          ))}
        </LibrarySection>

        <LibrarySection title="Benchmark Slots" isEmpty={abstractAssets.length === 0}>
          {abstractAssets.map((a) => (
            <AssetItem
              key={a.id}
              asset={a}
              onAdd={() => setDialog({ kind: 'asset', assetId: a.id })}
              disabled={!portfolio}
            />
          ))}
        </LibrarySection>

        <LibrarySection title="Models" isEmpty={concreteBundles.length === 0}>
          {concreteBundles.map((b) => (
            <BundleItem
              key={b.id}
              bundle={b}
              onAdd={() => setDialog({ kind: 'bundle', bundleId: b.id, type: 'bundle' })}
              disabled={!portfolio}
            />
          ))}
        </LibrarySection>

        <LibrarySection title="Benchmarks" isEmpty={abstractBundles.length === 0}>
          {abstractBundles.map((b) => (
            <BundleItem
              key={b.id}
              bundle={b}
              onAdd={() => setDialog({ kind: 'bundle', bundleId: b.id, type: 'abstract-bundle' })}
              disabled={!portfolio}
            />
          ))}
        </LibrarySection>
      </div>

      {dialog?.kind === 'asset' && (
        <AddAssetDialog
          assets={assetLibrary.assets}
          preselectedAssetId={dialog.assetId}
          onConfirm={handleAddAsset}
          onClose={() => setDialog(null)}
        />
      )}

      {dialog?.kind === 'bundle' && (
        <AddBundleDialog
          bundles={assetLibrary.bundles}
          assets={assetLibrary.assets}
          type={dialog.type}
          preselectedBundleId={dialog.bundleId}
          onConfirm={dialog.type === 'bundle' ? handleAddBundle : handleAddAbstractBundle}
          onClose={() => setDialog(null)}
        />
      )}
    </aside>
  );
}

function LibrarySection({
  title, isEmpty, children, locked = false, lockedHint,
}: {
  title: string;
  isEmpty: boolean;
  children: React.ReactNode;
  locked?: boolean;
  lockedHint?: string;
}) {
  return (
    <div className={`library-section${locked ? ' library-section-locked' : ''}`}>
      <div className="library-section-title">
        {title}
        {locked && <span className="library-lock-icon" title={lockedHint}>🔒</span>}
      </div>
      {isEmpty ? (
        <p className="empty-state-small">No results</p>
      ) : locked ? (
        <>
          {children}
          {lockedHint && <p className="library-locked-hint">{lockedHint}</p>}
        </>
      ) : (
        children
      )}
    </div>
  );
}

function AssetItem({ asset, onAdd, disabled }: { asset: AssetDef; onAdd: () => void; disabled: boolean }) {
  const badgeClass = asset.type === 'concrete' ? 'badge-blue' : 'badge-purple';
  const label = asset.type === 'concrete' ? asset.ticker : 'Benchmark';
  return (
    <div className="library-item">
      <span className={`badge ${badgeClass}`}>{label}</span>
      <div className="library-item-info">
        <span className="library-item-name">{asset.name}</span>
        <span className="library-item-meta">{asset.assetClass} · {asset.region}</span>
      </div>
      <button className="library-add-btn" onClick={onAdd} disabled={disabled} title="Add to portfolio">＋</button>
    </div>
  );
}

function BundleItem({ bundle, onAdd, disabled }: { bundle: BundleDef; onAdd: () => void; disabled: boolean }) {
  const badgeClass = bundle.type === 'bundle' ? 'badge-green' : 'badge-orange';
  const label = bundle.type === 'bundle' ? 'Model' : 'Benchmark';
  return (
    <div className="library-item">
      <span className={`badge ${badgeClass}`}>{label}</span>
      <div className="library-item-info">
        <span className="library-item-name">{bundle.name}</span>
        <span className="library-item-meta">{bundle.components.length} components</span>
      </div>
      <button className="library-add-btn" onClick={onAdd} disabled={disabled} title="Add to portfolio">＋</button>
    </div>
  );
}
