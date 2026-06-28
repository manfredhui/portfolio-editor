export interface EodhdGeneral {
  Code: string;
  Type: string;
  Name: string;
  Exchange: string;
  CurrencyCode: string;
  CurrencySymbol: string;
  CountryName: string;
  ISIN: string | null;
  Fund_Summary: string | null;
  Fund_Family: string | null;
  Fund_Category: string | null;
  Fund_Style: string | null;
  MarketCapitalization: number;
}

// API uses property names with '%' which aren't valid TS identifiers — use Record<string,unknown>
export type EodhdAllocationSlice = Record<string, unknown> & { Type: string };
export type EodhdHoldingRaw = { Name: string; Weight: string };
export type EodhdRegionSlice = Record<string, unknown> & { Name: string };
export type EodhdSectorSlice = Record<string, unknown> & { Name: string };

export interface EodhdMutualFundData {
  Fund_Category: string | null;
  Fund_Style: string | null;
  Nav: string | null;
  Prev_Close_Price: string | null;
  Update_Date: string | null;
  Portfolio_Net_Assets: string | null;
  Inception_Date: string | null;
  Currency: string | null;
  Yield: string | null;
  Yield_YTD: string | null;
  Yield_1Year_YTD: string | null;
  Yield_3Year_YTD: string | null;
  Yield_5Year_YTD: string | null;
  Expense_Ratio: string | null;
  Expense_Ratio_Date: string | null;
  Asset_Allocation: Record<string, EodhdAllocationSlice>;
  Top_Holdings: Record<string, EodhdHoldingRaw>;
  World_Regions: Record<string, Record<string, EodhdRegionSlice>>;
  Sector_Weights: Record<string, Record<string, EodhdSectorSlice>>;
}

export interface EodhdFundData {
  General: EodhdGeneral;
  MutualFund_Data: EodhdMutualFundData;
}

// Normalised shapes used by the UI
export interface AllocationSlice { type: string; net: number }
export interface Holding { name: string; weight: number }
export interface RegionSlice { name: string; pct: number }
export interface SectorSlice { name: string; pct: number }

export interface NormalisedFundData {
  name: string;
  fundFamily: string | null;
  category: string | null;
  nav: number | null;
  expenseRatio: number | null;
  inceptionDate: string | null;
  updateDate: string | null;
  yields: { ytd: number | null; oneYear: number | null; threeYear: number | null; fiveYear: number | null };
  allocation: AllocationSlice[];
  topHoldings: Holding[];
  worldRegions: { group: string; regions: RegionSlice[] }[];
  sectorWeights: { group: string; sectors: SectorSlice[] }[];
  isMock?: boolean;
}

const cache = new Map<string, NormalisedFundData>();

function parseNum(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === 'string' ? parseFloat(v.replace('%', '')) : Number(v);
  return isNaN(n) ? null : n;
}

function objectValues<T>(obj: Record<string, T> | null | undefined): T[] {
  if (!obj) return [];
  return Object.values(obj);
}

function normalise(raw: EodhdFundData): NormalisedFundData {
  const g = raw.General;
  const mf = raw.MutualFund_Data;

  const allocation: AllocationSlice[] = objectValues(mf.Asset_Allocation)
    .map((s) => ({ type: s.Type as string, net: parseNum(s['Net_%']) ?? 0 }))
    .filter((s) => s.net > 0)
    .sort((a, b) => b.net - a.net);

  const topHoldings: Holding[] = objectValues(mf.Top_Holdings).map((h) => ({
    name: h.Name,
    weight: parseNum(h.Weight) ?? 0,
  }));

  const worldRegions = Object.entries(mf.World_Regions ?? {}).map(([group, regions]) => ({
    group,
    regions: objectValues(regions)
      .map((r) => ({ name: r.Name as string, pct: parseNum(r['Stocks_%']) ?? 0 }))
      .filter((r) => r.pct > 0),
  })).filter((g) => g.regions.length > 0);

  const sectorWeights = Object.entries(mf.Sector_Weights ?? {}).map(([group, sectors]) => ({
    group,
    sectors: objectValues(sectors)
      .map((s) => ({ name: s.Name as string, pct: parseNum(s['Amount_%']) ?? 0 }))
      .filter((s) => s.pct > 0),
  })).filter((g) => g.sectors.length > 0);

  return {
    name: g.Name,
    fundFamily: g.Fund_Family,
    category: g.Fund_Category,
    nav: parseNum(mf.Nav),
    expenseRatio: parseNum(mf.Expense_Ratio),
    inceptionDate: mf.Inception_Date,
    updateDate: mf.Update_Date,
    yields: {
      ytd: parseNum(mf.Yield_YTD),
      oneYear: parseNum(mf.Yield_1Year_YTD),
      threeYear: parseNum(mf.Yield_3Year_YTD),
      fiveYear: parseNum(mf.Yield_5Year_YTD),
    },
    allocation,
    topHoldings,
    worldRegions,
    sectorWeights,
  };
}

export async function fetchFundData(
  symbol: string,
  apiToken = 'demo'
): Promise<NormalisedFundData> {
  const key = `${symbol}::${apiToken}`;
  if (cache.has(key)) return cache.get(key)!;

  // Route non-demo symbols to mock data — the demo token only works for SWPPX.US
  const { getMockFundData } = await import('./mockFundData');
  const mock = getMockFundData(symbol);
  if (mock) {
    const data = { ...mock, isMock: true };
    cache.set(key, data);
    return data;
  }

  const url = `https://eodhd.com/api/fundamentals/${symbol}?filter=General,MutualFund_Data&api_token=${apiToken}&fmt=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`EODHD ${res.status}: ${res.statusText}`);
  const raw: EodhdFundData = await res.json();
  const data = { ...normalise(raw), isMock: false };
  cache.set(key, data);
  return data;
}

export function clearFundCache() {
  cache.clear();
}
