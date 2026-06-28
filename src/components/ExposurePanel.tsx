import { useEffect, useState } from 'react';
import { useExposurePanel } from '../hooks/useExposurePanel';
import { usePortfolio } from '../hooks/usePortfolio';
import { fetchFundData, NormalisedFundData } from '../services/eodhdService';

const ALLOC_COLORS: Record<string, string> = {
  'US Stock': '#3b82f6',
  'Non US Stock': '#06b6d4',
  Bond: '#8b5cf6',
  Cash: '#22c55e',
  Other: '#94a3b8',
  'Not Classified': '#e2e8f0',
};

function allocColor(type: string): string {
  return ALLOC_COLORS[type] ?? '#94a3b8';
}

function fmt(n: number | null, decimals = 2, suffix = ''): string {
  if (n == null) return '—';
  return `${n.toFixed(decimals)}${suffix}`;
}

function YieldBadge({ label, value }: { label: string; value: number | null }) {
  if (value == null) return null;
  const pos = value >= 0;
  return (
    <div className="ep-yield-badge">
      <span className="ep-yield-label">{label}</span>
      <span className={`ep-yield-val ${pos ? 'yield-pos' : 'yield-neg'}`}>
        {pos ? '+' : ''}{value.toFixed(2)}%
      </span>
    </div>
  );
}

function AllocationBar({ slices }: { slices: NormalisedFundData['allocation'] }) {
  const total = slices.reduce((s, a) => s + Math.max(0, a.net), 0);
  if (total === 0) return <p className="ep-empty">No allocation data</p>;
  return (
    <div>
      <div className="ep-alloc-bar">
        {slices.filter((s) => s.net > 0).map((s) => (
          <div
            key={s.type}
            className="ep-alloc-segment"
            style={{ width: `${(s.net / total) * 100}%`, background: allocColor(s.type) }}
            title={`${s.type}: ${s.net.toFixed(2)}%`}
          />
        ))}
      </div>
      <div className="ep-alloc-legend">
        {slices.filter((s) => s.net > 0).map((s) => (
          <div key={s.type} className="ep-alloc-legend-item">
            <span className="ep-alloc-dot" style={{ background: allocColor(s.type) }} />
            <span className="ep-alloc-type">{s.type}</span>
            <span className="ep-alloc-pct">{s.net.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoldingsTable({ holdings }: { holdings: NormalisedFundData['topHoldings'] }) {
  if (!holdings.length) return <p className="ep-empty">No holdings data</p>;
  const max = Math.max(...holdings.map((h) => h.weight));
  return (
    <table className="ep-holdings-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Weight</th>
          <th style={{ width: 100 }}></th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((h, i) => (
          <tr key={i}>
            <td className="ep-holding-rank">{i + 1}</td>
            <td className="ep-holding-name">{h.name}</td>
            <td className="ep-holding-weight">{h.weight.toFixed(2)}%</td>
            <td>
              <div className="ep-holding-bar-track">
                <div
                  className="ep-holding-bar-fill"
                  style={{ width: `${max > 0 ? (h.weight / max) * 100 : 0}%` }}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RegionsSection({ regions }: { regions: NormalisedFundData['worldRegions'] }) {
  if (!regions.length) return <p className="ep-empty">No region data</p>;
  return (
    <div className="ep-regions">
      {regions.map((g) => (
        <div key={g.group} className="ep-region-group">
          <div className="ep-region-group-name">{g.group}</div>
          {g.regions.map((r) => (
            <div key={r.name} className="ep-region-row">
              <span className="ep-region-name">{r.name}</span>
              <div className="ep-region-bar-track">
                <div className="ep-region-bar-fill" style={{ width: `${Math.min(100, r.pct)}%` }} />
              </div>
              <span className="ep-region-pct">{r.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SectorsSection({ sectors }: { sectors: NormalisedFundData['sectorWeights'] }) {
  const GROUP_COLORS: Record<string, string> = {
    Cyclical: '#f59e0b',
    Defensive: '#22c55e',
    Sensitive: '#3b82f6',
  };
  if (!sectors.length) return <p className="ep-empty">No sector data</p>;
  return (
    <div className="ep-sectors">
      {sectors.map((g) => (
        <div key={g.group} className="ep-sector-group">
          <div className="ep-sector-group-name" style={{ color: GROUP_COLORS[g.group] ?? '#64748b' }}>
            {g.group}
          </div>
          {g.sectors.map((s) => (
            <div key={s.name} className="ep-sector-row">
              <span className="ep-sector-name">{s.name}</span>
              <div className="ep-sector-bar-track">
                <div
                  className="ep-sector-bar-fill"
                  style={{
                    width: `${Math.min(100, s.pct)}%`,
                    background: GROUP_COLORS[g.group] ?? '#64748b',
                  }}
                />
              </div>
              <span className="ep-sector-pct">{s.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ExposurePanel() {
  const { selectedAssetId, apiToken, close } = useExposurePanel();
  const { assetLibrary } = usePortfolio();

  const [data, setData] = useState<NormalisedFundData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'allocation' | 'holdings' | 'regions' | 'sectors'>('allocation');

  const assetDef = selectedAssetId
    ? assetLibrary.assets.find((a) => a.id === selectedAssetId)
    : null;

  useEffect(() => {
    if (!assetDef?.eodhdSymbol) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetchFundData(assetDef.eodhdSymbol, apiToken)
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(String(e.message ?? e)); setLoading(false); });
  }, [assetDef?.eodhdSymbol, apiToken]);

  if (!selectedAssetId) return null;

  return (
    <>
      <div className="ep-backdrop" onClick={close} />
      <div className="ep-panel">
        <div className="ep-header">
          <div className="ep-header-left">
            <div className="ep-asset-ticker">{assetDef?.ticker ?? assetDef?.id}</div>
            <div className="ep-asset-name">{assetDef?.name}</div>
            <div className="ep-asset-meta">
              <span className="badge badge-blue">{assetDef?.assetClass}</span>
              <span className="badge badge-gray">{assetDef?.region}</span>
              {assetDef?.eodhdSymbol && (
                <span className="ep-eodhd-symbol">EODHD: {assetDef.eodhdSymbol}</span>
              )}
            </div>
          </div>
          <button className="ep-close-btn" onClick={close} title="Close">✕</button>
        </div>

        {loading && (
          <div className="ep-loading">
            <div className="ep-spinner" />
            <span>Fetching exposure data…</span>
          </div>
        )}

        {error && (
          <div className="ep-error">
            <span>⚠ {error}</span>
            <p className="ep-error-hint">
              The demo API token only works for <code>SWPPX.US</code>. In production, provide a real API token and per-asset EODHD symbols.
            </p>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Fund overview */}
            <div className="ep-overview">
              <div className="ep-overview-left">
                <div className="ep-fund-name">{data.name}</div>
                {data.fundFamily && <div className="ep-fund-family">{data.fundFamily}</div>}
                {data.category && <div className="ep-fund-category">{data.category}</div>}
              {data.isMock != null && (
                <span className={data.isMock ? 'ep-badge-mock' : 'ep-badge-live'}>
                  {data.isMock ? '◉ Mock data' : '● Live · EODHD'}
                </span>
              )}
              </div>
              <div className="ep-overview-right">
                <div className="ep-stat">
                  <span className="ep-stat-label">NAV</span>
                  <span className="ep-stat-val">{fmt(data.nav, 2, ' ' + 'USD')}</span>
                </div>
                <div className="ep-stat">
                  <span className="ep-stat-label">Expense Ratio</span>
                  <span className="ep-stat-val">{fmt(data.expenseRatio != null ? data.expenseRatio * 100 : null, 2, '%')}</span>
                </div>
                {data.inceptionDate && (
                  <div className="ep-stat">
                    <span className="ep-stat-label">Inception</span>
                    <span className="ep-stat-val">{data.inceptionDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Yields */}
            <div className="ep-yields">
              <YieldBadge label="YTD" value={data.yields.ytd} />
              <YieldBadge label="1Y" value={data.yields.oneYear} />
              <YieldBadge label="3Y" value={data.yields.threeYear} />
              <YieldBadge label="5Y" value={data.yields.fiveYear} />
            </div>

            {/* Tabs */}
            <div className="ep-tabs">
              {(['allocation', 'holdings', 'regions', 'sectors'] as const).map((t) => (
                <button
                  key={t}
                  className={`ep-tab${activeTab === t ? ' ep-tab-active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="ep-tab-content">
              {activeTab === 'allocation' && <AllocationBar slices={data.allocation} />}
              {activeTab === 'holdings' && <HoldingsTable holdings={data.topHoldings} />}
              {activeTab === 'regions' && <RegionsSection regions={data.worldRegions} />}
              {activeTab === 'sectors' && <SectorsSection sectors={data.sectorWeights} />}
            </div>

            <div className="ep-footer">
              {data.isMock
                ? '⚠ Mock data · replace eodhdSymbol with a real token to fetch live'
                : `Live · EODHD API · as of ${data.updateDate ?? '—'}`}
            </div>
          </>
        )}

        {!data && !loading && !error && assetDef && !assetDef.eodhdSymbol && (
          <div className="ep-error">
            <span>No EODHD symbol configured for this asset.</span>
          </div>
        )}
      </div>
    </>
  );
}
