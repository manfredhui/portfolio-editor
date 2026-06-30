import type { NormalisedFundData } from './eodhdService';

// Realistic mock data for assets whose EODHD symbol isn't supported by the demo token.
// SWPPX.US is the only symbol that works with api_token=demo — that one is fetched live.
// All other symbols route here so the UI stays functional without a paid API key.

const MOCK: Record<string, NormalisedFundData> = {

  'VGK.US': {
    name: 'Vanguard FTSE Europe ETF',
    fundFamily: 'Vanguard',
    category: 'Europe Stock',
    nav: 68.42,
    expenseRatio: 0.0009,
    inceptionDate: '2005-03-04',
    updateDate: '2026-06-27',
    yields: { ytd: 14.2, oneYear: 19.8, threeYear: 8.4, fiveYear: 7.1 },
    allocation: [
      { type: 'Non US Stock', net: 96.8 },
      { type: 'Cash', net: 2.1 },
      { type: 'Other', net: 1.1 },
    ],
    topHoldings: [
      { name: 'Novo Nordisk A/S B', weight: 4.12 },
      { name: 'ASML Holding NV', weight: 3.88 },
      { name: 'Nestlé SA', weight: 2.94 },
      { name: 'LVMH Moët Hennessy', weight: 2.71 },
      { name: 'Shell PLC', weight: 2.43 },
      { name: 'Roche Holding AG', weight: 2.18 },
      { name: 'AstraZeneca PLC', weight: 2.05 },
      { name: 'HSBC Holdings PLC', weight: 1.87 },
      { name: 'SAP SE', weight: 1.76 },
      { name: 'Siemens AG', weight: 1.54 },
    ],
    worldRegions: [
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 70.4 },
        { name: 'United Kingdom', pct: 23.8 },
        { name: 'Europe Emerging', pct: 0.8 },
      ]},
      { group: 'Americas', regions: [
        { name: 'North America', pct: 3.2 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Asia Developed', pct: 1.8 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 11.2 },
        { name: 'Basic Materials', pct: 6.8 },
        { name: 'Financial Services', pct: 18.4 },
        { name: 'Real Estate', pct: 1.2 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 10.1 },
        { name: 'Healthcare', pct: 14.3 },
        { name: 'Utilities', pct: 4.2 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 4.8 },
        { name: 'Energy', pct: 5.1 },
        { name: 'Industrials', pct: 14.7 },
        { name: 'Technology', pct: 9.2 },
      ]},
    ],
  },

  'EWJ.US': {
    name: 'iShares MSCI Japan ETF',
    fundFamily: 'BlackRock',
    category: 'Japan Stock',
    nav: 72.14,
    expenseRatio: 0.0050,
    inceptionDate: '1996-03-12',
    updateDate: '2026-06-27',
    yields: { ytd: 3.1, oneYear: 8.7, threeYear: 6.2, fiveYear: 5.4 },
    allocation: [
      { type: 'Non US Stock', net: 96.7 },
      { type: 'Cash', net: 2.8 },
      { type: 'Other', net: 0.5 },
    ],
    topHoldings: [
      { name: 'Toyota Motor Corp', weight: 5.24 },
      { name: 'Sony Group Corp', weight: 3.87 },
      { name: 'Keyence Corp', weight: 2.91 },
      { name: 'Mitsubishi UFJ Financial', weight: 2.74 },
      { name: 'SoftBank Group Corp', weight: 2.43 },
      { name: 'Nintendo Co', weight: 2.11 },
      { name: 'Honda Motor Co', weight: 1.98 },
      { name: 'Hitachi Ltd', weight: 1.84 },
      { name: 'Fast Retailing Co', weight: 1.72 },
      { name: 'Recruit Holdings', weight: 1.61 },
    ],
    worldRegions: [
      { group: 'Greater Asia', regions: [
        { name: 'Japan', pct: 96.7 },
        { name: 'Asia Developed', pct: 1.4 },
      ]},
      { group: 'Americas', regions: [
        { name: 'North America', pct: 1.4 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 0.5 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 15.3 },
        { name: 'Basic Materials', pct: 5.6 },
        { name: 'Financial Services', pct: 14.2 },
        { name: 'Real Estate', pct: 2.8 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 5.4 },
        { name: 'Healthcare', pct: 7.2 },
        { name: 'Utilities', pct: 2.1 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 7.8 },
        { name: 'Energy', pct: 1.9 },
        { name: 'Industrials', pct: 22.4 },
        { name: 'Technology', pct: 15.3 },
      ]},
    ],
  },

  'VWO.US': {
    name: 'Vanguard FTSE Emerging Markets ETF',
    fundFamily: 'Vanguard',
    category: 'Diversified Emerging Mkts',
    nav: 44.87,
    expenseRatio: 0.0008,
    inceptionDate: '2005-03-04',
    updateDate: '2026-06-27',
    yields: { ytd: 8.4, oneYear: 14.2, threeYear: 3.1, fiveYear: 2.8 },
    allocation: [
      { type: 'Non US Stock', net: 95.2 },
      { type: 'Cash', net: 3.6 },
      { type: 'Other', net: 1.2 },
    ],
    topHoldings: [
      { name: 'Taiwan Semiconductor Mfg', weight: 8.41 },
      { name: 'Tencent Holdings Ltd', weight: 4.72 },
      { name: 'Samsung Electronics', weight: 3.94 },
      { name: 'Alibaba Group Holding', weight: 2.83 },
      { name: 'Reliance Industries Ltd', weight: 2.14 },
      { name: 'Infosys Ltd', weight: 1.87 },
      { name: 'Meituan', weight: 1.74 },
      { name: 'HDFC Bank Ltd', weight: 1.61 },
      { name: 'JD.com Inc', weight: 1.43 },
      { name: 'Pinduoduo Inc', weight: 1.28 },
    ],
    worldRegions: [
      { group: 'Greater Asia', regions: [
        { name: 'Asia Emerging', pct: 62.4 },
        { name: 'Asia Developed', pct: 8.7 },
        { name: 'Japan', pct: 0.2 },
      ]},
      { group: 'Americas', regions: [
        { name: 'Latin America', pct: 10.8 },
        { name: 'North America', pct: 0.4 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Emerging', pct: 5.2 },
        { name: 'Africa/Middle East', pct: 8.1 },
        { name: 'Europe Developed', pct: 3.8 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 12.1 },
        { name: 'Basic Materials', pct: 7.4 },
        { name: 'Financial Services', pct: 22.3 },
        { name: 'Real Estate', pct: 3.4 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 5.8 },
        { name: 'Healthcare', pct: 4.2 },
        { name: 'Utilities', pct: 3.9 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 10.4 },
        { name: 'Energy', pct: 6.2 },
        { name: 'Industrials', pct: 7.8 },
        { name: 'Technology', pct: 16.5 },
      ]},
    ],
  },

  'QQQ.US': {
    name: 'Invesco QQQ Trust',
    fundFamily: 'Invesco',
    category: 'Large Growth',
    nav: 487.32,
    expenseRatio: 0.0020,
    inceptionDate: '1999-03-10',
    updateDate: '2026-06-27',
    yields: { ytd: 12.1, oneYear: 31.4, threeYear: 24.7, fiveYear: 18.9 },
    allocation: [
      { type: 'US Stock', net: 97.8 },
      { type: 'Non US Stock', net: 1.6 },
      { type: 'Cash', net: 0.6 },
    ],
    topHoldings: [
      { name: 'Microsoft Corp', weight: 8.94 },
      { name: 'Apple Inc', weight: 8.71 },
      { name: 'NVIDIA Corp', weight: 8.43 },
      { name: 'Amazon.com Inc', weight: 5.87 },
      { name: 'Meta Platforms Inc', weight: 5.14 },
      { name: 'Alphabet Inc Class A', weight: 4.62 },
      { name: 'Alphabet Inc Class C', weight: 4.01 },
      { name: 'Tesla Inc', weight: 3.74 },
      { name: 'Broadcom Inc', weight: 3.28 },
      { name: 'Costco Wholesale Corp', weight: 2.74 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 97.8 },
        { name: 'Latin America', pct: 0.2 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Asia Developed', pct: 1.2 },
        { name: 'Asia Emerging', pct: 0.4 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 0.4 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 14.8 },
        { name: 'Financial Services', pct: 0.8 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 6.2 },
        { name: 'Healthcare', pct: 6.1 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 16.4 },
        { name: 'Industrials', pct: 3.2 },
        { name: 'Technology', pct: 52.5 },
      ]},
    ],
  },

  'TLT.US': {
    name: 'iShares 20+ Year Treasury Bond ETF',
    fundFamily: 'BlackRock',
    category: 'Long Government',
    nav: 88.14,
    expenseRatio: 0.0015,
    inceptionDate: '2002-07-22',
    updateDate: '2026-06-27',
    yields: { ytd: -2.8, oneYear: 1.4, threeYear: -9.2, fiveYear: -4.7 },
    allocation: [
      { type: 'Bond', net: 99.1 },
      { type: 'Cash', net: 0.9 },
    ],
    topHoldings: [
      { name: 'US Treasury 4.375% 2054', weight: 4.84 },
      { name: 'US Treasury 4.500% 2039', weight: 4.71 },
      { name: 'US Treasury 4.125% 2053', weight: 4.43 },
      { name: 'US Treasury 3.875% 2043', weight: 4.18 },
      { name: 'US Treasury 4.750% 2053', weight: 3.97 },
      { name: 'US Treasury 3.625% 2053', weight: 3.84 },
      { name: 'US Treasury 4.250% 2039', weight: 3.61 },
      { name: 'US Treasury 2.875% 2052', weight: 3.44 },
      { name: 'US Treasury 3.000% 2048', weight: 3.27 },
      { name: 'US Treasury 3.375% 2048', weight: 3.12 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 99.1 },
      ]},
    ],
    sectorWeights: [
      { group: 'Defensive', sectors: [
        { name: 'Government', pct: 99.1 },
      ]},
    ],
  },

  'IEAG.LSE': {
    name: 'iShares Core EUR Aggregate Bond UCITS ETF',
    fundFamily: 'BlackRock',
    category: 'EUR Diversified Bond',
    nav: 48.72,
    expenseRatio: 0.0010,
    inceptionDate: '2009-11-13',
    updateDate: '2026-06-27',
    yields: { ytd: 1.2, oneYear: 4.8, threeYear: -2.4, fiveYear: -0.9 },
    allocation: [
      { type: 'Bond', net: 97.4 },
      { type: 'Cash', net: 2.6 },
    ],
    topHoldings: [
      { name: 'Germany 0% 2031', weight: 2.14 },
      { name: 'France OAT 0.5% 2029', weight: 1.97 },
      { name: 'Italy BTP 3.85% 2035', weight: 1.84 },
      { name: 'Spain Obligaciones 0.25% 2029', weight: 1.71 },
      { name: 'Germany 1.25% 2048', weight: 1.58 },
      { name: 'France OAT 1.75% 2066', weight: 1.43 },
      { name: 'Netherlands DSL 0% 2033', weight: 1.32 },
      { name: 'Belgium OLO 1.45% 2037', weight: 1.21 },
      { name: 'European Investment Bank 0.01% 2031', weight: 1.14 },
      { name: 'Spain Obligaciones 2.35% 2033', weight: 1.08 },
    ],
    worldRegions: [
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 84.2 },
        { name: 'United Kingdom', pct: 3.4 },
        { name: 'Europe Emerging', pct: 2.1 },
      ]},
      { group: 'Americas', regions: [
        { name: 'North America', pct: 4.8 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Japan', pct: 2.9 },
        { name: 'Asia Developed', pct: 2.6 },
      ]},
    ],
    sectorWeights: [
      { group: 'Defensive', sectors: [
        { name: 'Government', pct: 58.4 },
        { name: 'Corporate Investment Grade', pct: 26.7 },
        { name: 'Supranational', pct: 12.3 },
      ]},
    ],
  },

  'TIP.US': {
    name: 'iShares TIPS Bond ETF',
    fundFamily: 'BlackRock',
    category: 'Inflation-Protected Bond',
    nav: 106.84,
    expenseRatio: 0.0019,
    inceptionDate: '2003-12-04',
    updateDate: '2026-06-27',
    yields: { ytd: 3.4, oneYear: 6.2, threeYear: -0.8, fiveYear: 2.1 },
    allocation: [
      { type: 'Bond', net: 98.7 },
      { type: 'Cash', net: 1.3 },
    ],
    topHoldings: [
      { name: 'US Treasury Inflation Index 0.125% 2052', weight: 4.21 },
      { name: 'US Treasury Inflation Index 0.125% 2031', weight: 3.94 },
      { name: 'US Treasury Inflation Index 0.5% 2028', weight: 3.71 },
      { name: 'US Treasury Inflation Index 3.625% 2028', weight: 3.54 },
      { name: 'US Treasury Inflation Index 0.625% 2032', weight: 3.38 },
      { name: 'US Treasury Inflation Index 0.125% 2030', weight: 3.17 },
      { name: 'US Treasury Inflation Index 1.75% 2028', weight: 2.94 },
      { name: 'US Treasury Inflation Index 0.125% 2029', weight: 2.81 },
      { name: 'US Treasury Inflation Index 2.5% 2029', weight: 2.64 },
      { name: 'US Treasury Inflation Index 0.375% 2027', weight: 2.47 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 98.7 },
      ]},
    ],
    sectorWeights: [
      { group: 'Defensive', sectors: [
        { name: 'Government (Inflation-Linked)', pct: 98.7 },
      ]},
    ],
  },

  'HYG.US': {
    name: 'iShares iBoxx $ High Yield Corporate Bond ETF',
    fundFamily: 'BlackRock',
    category: 'High Yield Bond',
    nav: 77.42,
    expenseRatio: 0.0049,
    inceptionDate: '2007-04-04',
    updateDate: '2026-06-27',
    yields: { ytd: 4.8, oneYear: 8.4, threeYear: 3.2, fiveYear: 4.1 },
    allocation: [
      { type: 'Bond', net: 88.4 },
      { type: 'Cash', net: 9.2 },
      { type: 'Other', net: 2.4 },
    ],
    topHoldings: [
      { name: 'TransDigm Group 4.875% 2029', weight: 0.74 },
      { name: 'Carnival Corp 5.75% 2027', weight: 0.68 },
      { name: 'Occidental Petroleum 6.125% 2031', weight: 0.63 },
      { name: 'Caesars Entertainment 8.125% 2027', weight: 0.61 },
      { name: 'Intelsat Jackson 6.5% 2030', weight: 0.58 },
      { name: 'Clear Channel Outdoor 7.5% 2029', weight: 0.54 },
      { name: 'Sprint Capital Corp 6.875% 2028', weight: 0.52 },
      { name: 'Bausch Health Companies 5.5% 2028', weight: 0.49 },
      { name: 'Gates Industrial Corp 6.25% 2026', weight: 0.47 },
      { name: 'Avaya Inc 6.125% 2028', weight: 0.44 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 92.4 },
        { name: 'Latin America', pct: 1.8 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 4.2 },
        { name: 'United Kingdom', pct: 1.2 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Asia Emerging', pct: 0.4 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 12.4 },
        { name: 'Basic Materials', pct: 4.8 },
        { name: 'Financial Services', pct: 8.2 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Healthcare', pct: 8.4 },
        { name: 'Consumer Defensive', pct: 3.2 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 14.7 },
        { name: 'Energy', pct: 14.2 },
        { name: 'Industrials', pct: 12.8 },
        { name: 'Technology', pct: 8.1 },
        { name: 'Utilities', pct: 13.2 },
      ]},
    ],
  },

  'GLD.US': {
    name: 'SPDR Gold Shares',
    fundFamily: 'State Street',
    category: 'Commodities Precious Metals',
    nav: 278.94,
    expenseRatio: 0.0040,
    inceptionDate: '2004-11-18',
    updateDate: '2026-06-27',
    yields: { ytd: 24.7, oneYear: 38.2, threeYear: 16.4, fiveYear: 12.8 },
    allocation: [
      { type: 'Other', net: 99.2 },
      { type: 'Cash', net: 0.8 },
    ],
    topHoldings: [
      { name: 'Gold (Physical Bullion)', weight: 99.2 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America (Custodian)', pct: 99.2 },
      ]},
    ],
    sectorWeights: [
      { group: 'Sensitive', sectors: [
        { name: 'Precious Metals (Gold)', pct: 99.2 },
      ]},
    ],
  },

  'VNQ.US': {
    name: 'Vanguard Real Estate ETF',
    fundFamily: 'Vanguard',
    category: 'Real Estate',
    nav: 84.17,
    expenseRatio: 0.0012,
    inceptionDate: '2004-09-23',
    updateDate: '2026-06-27',
    yields: { ytd: 2.4, oneYear: 7.8, threeYear: -1.2, fiveYear: 3.4 },
    allocation: [
      { type: 'US Stock', net: 97.8 },
      { type: 'Cash', net: 1.4 },
      { type: 'Other', net: 0.8 },
    ],
    topHoldings: [
      { name: 'American Tower Corp', weight: 7.24 },
      { name: 'Prologis Inc', weight: 6.87 },
      { name: 'Crown Castle Inc', weight: 4.94 },
      { name: 'Equinix Inc', weight: 4.71 },
      { name: 'Public Storage', weight: 3.84 },
      { name: 'Simon Property Group', weight: 3.47 },
      { name: 'Digital Realty Trust', weight: 3.21 },
      { name: 'Realty Income Corp', weight: 3.08 },
      { name: 'SBA Communications Corp', weight: 2.94 },
      { name: 'Welltower Inc', weight: 2.81 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 97.8 },
        { name: 'Latin America', pct: 0.4 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Asia Developed', pct: 1.2 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 0.6 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Real Estate', pct: 97.8 },
      ]},
    ],
  },

  'BCI.US': {
    name: 'abrdn Bloomberg All Commodity Strategy K-1 Free ETF',
    fundFamily: 'abrdn',
    category: 'Commodities Broad Basket',
    nav: 22.47,
    expenseRatio: 0.0025,
    inceptionDate: '2017-03-30',
    updateDate: '2026-06-27',
    yields: { ytd: 3.8, oneYear: 6.2, threeYear: -1.4, fiveYear: 4.7 },
    allocation: [
      { type: 'Other', net: 88.4 },
      { type: 'Cash', net: 11.6 },
    ],
    topHoldings: [
      { name: 'WTI Crude Oil Futures', weight: 11.2 },
      { name: 'Brent Crude Oil Futures', weight: 9.8 },
      { name: 'Gold Futures', weight: 8.7 },
      { name: 'Natural Gas Futures', weight: 7.4 },
      { name: 'Corn Futures', weight: 6.8 },
      { name: 'Soybean Futures', weight: 6.2 },
      { name: 'Copper Futures', weight: 5.9 },
      { name: 'Wheat Futures', weight: 5.4 },
      { name: 'Aluminium Futures', weight: 4.8 },
      { name: 'Silver Futures', weight: 4.2 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'Global Commodity Markets', pct: 88.4 },
      ]},
    ],
    sectorWeights: [
      { group: 'Sensitive', sectors: [
        { name: 'Energy', pct: 32.4 },
        { name: 'Precious Metals', pct: 16.8 },
        { name: 'Industrial Metals', pct: 16.2 },
        { name: 'Agricultural', pct: 23.0 },
      ]},
    ],
  },

  'GHYG.US': {
    name: 'iShares Global High Yield Corporate Bond ETF',
    fundFamily: 'BlackRock',
    category: 'High Yield Bond',
    nav: 57.34,
    expenseRatio: 0.0040,
    inceptionDate: '2012-04-03',
    updateDate: '2026-06-27',
    yields: { ytd: 4.8, oneYear: 8.2, threeYear: 4.1, fiveYear: 4.6 },
    allocation: [
      { type: 'Bond', net: 88.4 },
      { type: 'Cash', net: 9.8 },
      { type: 'Other', net: 1.8 },
    ],
    topHoldings: [
      { name: 'TransDigm Group 6.375% 2029', weight: 0.62 },
      { name: 'Altice France 5.125% 2029', weight: 0.58 },
      { name: 'Carnival Corp 5.75% 2027', weight: 0.54 },
      { name: 'Telecom Italia 5.303% 2030', weight: 0.51 },
      { name: 'Ford Motor Co 4.346% 2026', weight: 0.48 },
      { name: 'Ardagh Metal Packaging 4.0% 2029', weight: 0.45 },
      { name: 'Volkswagen International 3.875% 2026', weight: 0.43 },
      { name: 'Ineos Group 6.375% 2026', weight: 0.41 },
      { name: 'Univision Communications 6.625% 2027', weight: 0.39 },
      { name: 'Matterhorn Telecom 3.125% 2026', weight: 0.37 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 54.2 },
        { name: 'Latin America', pct: 2.4 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 28.6 },
        { name: 'United Kingdom', pct: 6.8 },
        { name: 'Europe Emerging', pct: 2.2 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Asia Developed', pct: 2.8 },
        { name: 'Asia Emerging', pct: 2.4 },
        { name: 'Australasia', pct: 0.6 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 14.8 },
        { name: 'Financial Services', pct: 8.4 },
        { name: 'Basic Materials', pct: 6.2 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 6.4 },
        { name: 'Healthcare', pct: 10.8 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 16.2 },
        { name: 'Energy', pct: 12.4 },
        { name: 'Industrials', pct: 14.6 },
        { name: 'Technology', pct: 10.2 },
      ]},
    ],
  },

  'IHYU.LSE': {
    name: 'iShares € High Yield Corp Bond UCITS ETF',
    fundFamily: 'BlackRock',
    category: 'European High Yield Bond',
    nav: 89.12,
    expenseRatio: 0.0050,
    inceptionDate: '2010-06-28',
    updateDate: '2026-06-27',
    yields: { ytd: 4.2, oneYear: 7.6, threeYear: 3.4, fiveYear: 3.8 },
    allocation: [
      { type: 'Bond', net: 90.2 },
      { type: 'Cash', net: 8.4 },
      { type: 'Other', net: 1.4 },
    ],
    topHoldings: [
      { name: 'Altice France 5.125% 2029', weight: 1.12 },
      { name: 'Telecom Italia 5.303% 2030', weight: 0.98 },
      { name: 'Ardagh Metal Packaging 4.0% 2029', weight: 0.88 },
      { name: 'Ineos Group 6.375% 2026', weight: 0.84 },
      { name: 'Matterhorn Telecom 3.125% 2026', weight: 0.76 },
      { name: 'Loxam SAS 3.25% 2025', weight: 0.72 },
      { name: 'Cirsa Finance International 7.875% 2023', weight: 0.68 },
      { name: 'Nidda Healthcare 3.5% 2024', weight: 0.64 },
      { name: 'Picard Groupe 4.0% 2026', weight: 0.61 },
      { name: 'Parts Europe 6.5% 2027', weight: 0.57 },
    ],
    worldRegions: [
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 72.4 },
        { name: 'United Kingdom', pct: 14.8 },
        { name: 'Europe Emerging', pct: 6.2 },
      ]},
      { group: 'Americas', regions: [
        { name: 'North America', pct: 4.8 },
        { name: 'Latin America', pct: 1.8 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 16.4 },
        { name: 'Financial Services', pct: 6.8 },
        { name: 'Basic Materials', pct: 8.4 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 8.2 },
        { name: 'Healthcare', pct: 12.4 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 18.6 },
        { name: 'Energy', pct: 8.8 },
        { name: 'Industrials', pct: 16.2 },
        { name: 'Technology', pct: 4.2 },
      ]},
    ],
  },

  'LQD.US': {
    name: 'iShares iBoxx $ Investment Grade Corporate Bond ETF',
    fundFamily: 'BlackRock',
    category: 'Corporate Bond',
    nav: 110.48,
    expenseRatio: 0.0014,
    inceptionDate: '2002-07-22',
    updateDate: '2026-06-27',
    yields: { ytd: 2.4, oneYear: 5.8, threeYear: 1.2, fiveYear: 2.1 },
    allocation: [
      { type: 'Bond', net: 94.6 },
      { type: 'Cash', net: 4.8 },
      { type: 'Other', net: 0.6 },
    ],
    topHoldings: [
      { name: 'Apple Inc 3.85% 2043', weight: 0.64 },
      { name: 'Microsoft Corp 2.921% 2052', weight: 0.58 },
      { name: 'JPMorgan Chase 3.702% 2051', weight: 0.54 },
      { name: 'Goldman Sachs 3.814% 2051', weight: 0.52 },
      { name: 'Bank of America 3.419% 2028', weight: 0.49 },
      { name: 'Amazon.com Inc 3.875% 2038', weight: 0.47 },
      { name: 'Anheuser-Busch InBev 4.375% 2038', weight: 0.44 },
      { name: 'Wells Fargo 3.526% 2028', weight: 0.42 },
      { name: 'Morgan Stanley 3.217% 2027', weight: 0.40 },
      { name: 'AT&T Inc 3.65% 2051', weight: 0.38 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 84.2 },
        { name: 'Latin America', pct: 2.4 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 8.6 },
        { name: 'United Kingdom', pct: 3.2 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Asia Developed', pct: 1.6 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 6.4 },
        { name: 'Financial Services', pct: 36.8 },
        { name: 'Basic Materials', pct: 3.2 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 8.4 },
        { name: 'Healthcare', pct: 10.2 },
        { name: 'Utilities', pct: 8.6 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 10.8 },
        { name: 'Energy', pct: 6.4 },
        { name: 'Industrials', pct: 4.8 },
        { name: 'Technology', pct: 4.4 },
      ]},
    ],
  },

  'CORP.LSE': {
    name: 'iShares Core Global Corporate Bond UCITS ETF',
    fundFamily: 'BlackRock',
    category: 'Global Corporate Bond',
    nav: 106.24,
    expenseRatio: 0.0025,
    inceptionDate: '2015-03-17',
    updateDate: '2026-06-27',
    yields: { ytd: 2.8, oneYear: 6.2, threeYear: 1.6, fiveYear: 2.4 },
    allocation: [
      { type: 'Bond', net: 93.8 },
      { type: 'Cash', net: 5.4 },
      { type: 'Other', net: 0.8 },
    ],
    topHoldings: [
      { name: 'Apple Inc 3.85% 2043', weight: 0.52 },
      { name: 'JPMorgan Chase 3.702% 2051', weight: 0.48 },
      { name: 'Microsoft Corp 2.921% 2052', weight: 0.46 },
      { name: 'Bank of America 3.419% 2028', weight: 0.44 },
      { name: 'EDF SA 3.625% 2035', weight: 0.42 },
      { name: 'Toyota Motor Finance 1.8% 2027', weight: 0.40 },
      { name: 'Goldman Sachs 3.814% 2051', weight: 0.38 },
      { name: 'Deutsche Telekom 2.25% 2030', weight: 0.36 },
      { name: 'Anheuser-Busch InBev 2.0% 2028', weight: 0.34 },
      { name: 'Volkswagen Leasing 0.875% 2025', weight: 0.32 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 56.4 },
        { name: 'Latin America', pct: 2.8 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 24.6 },
        { name: 'United Kingdom', pct: 8.4 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Japan', pct: 4.2 },
        { name: 'Asia Developed', pct: 2.8 },
        { name: 'Australasia', pct: 0.8 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 6.8 },
        { name: 'Financial Services', pct: 34.2 },
        { name: 'Basic Materials', pct: 4.2 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 8.6 },
        { name: 'Healthcare', pct: 9.4 },
        { name: 'Utilities', pct: 7.8 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 10.4 },
        { name: 'Energy', pct: 5.8 },
        { name: 'Industrials', pct: 8.4 },
        { name: 'Technology', pct: 4.4 },
      ]},
    ],
  },

  'IEAC.LSE': {
    name: 'iShares Core EUR Corporate Bond UCITS ETF',
    fundFamily: 'BlackRock',
    category: 'European Corporate Bond',
    nav: 119.86,
    expenseRatio: 0.0020,
    inceptionDate: '2003-02-28',
    updateDate: '2026-06-27',
    yields: { ytd: 2.2, oneYear: 5.4, threeYear: 0.8, fiveYear: 1.6 },
    allocation: [
      { type: 'Bond', net: 95.2 },
      { type: 'Cash', net: 4.2 },
      { type: 'Other', net: 0.6 },
    ],
    topHoldings: [
      { name: 'EDF SA 3.625% 2035', weight: 0.74 },
      { name: 'Deutsche Telekom 2.25% 2030', weight: 0.68 },
      { name: 'Volkswagen Leasing 0.875% 2025', weight: 0.64 },
      { name: 'BNP Paribas 1.5% 2025', weight: 0.62 },
      { name: 'LVMH Moët Hennessy 0.125% 2024', weight: 0.58 },
      { name: 'Anheuser-Busch InBev 2.0% 2028', weight: 0.56 },
      { name: 'Siemens Financieringsmaatschappij 1.65% 2026', weight: 0.54 },
      { name: 'Daimler AG 1.875% 2026', weight: 0.52 },
      { name: 'Engie SA 1.375% 2029', weight: 0.48 },
      { name: 'Sanofi 1.375% 2028', weight: 0.46 },
    ],
    worldRegions: [
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 82.4 },
        { name: 'United Kingdom', pct: 8.6 },
        { name: 'Europe Emerging', pct: 2.2 },
      ]},
      { group: 'Americas', regions: [
        { name: 'North America', pct: 5.4 },
        { name: 'Latin America', pct: 1.4 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 10.4 },
        { name: 'Financial Services', pct: 30.8 },
        { name: 'Basic Materials', pct: 4.8 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 10.2 },
        { name: 'Healthcare', pct: 8.6 },
        { name: 'Utilities', pct: 12.4 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 8.4 },
        { name: 'Energy', pct: 5.2 },
        { name: 'Industrials', pct: 9.2 },
      ]},
    ],
  },

  'EMB.US': {
    name: 'iShares J.P. Morgan USD Emerging Markets Bond ETF',
    fundFamily: 'BlackRock',
    category: 'Emerging Markets Bond',
    nav: 87.62,
    expenseRatio: 0.0039,
    inceptionDate: '2007-12-17',
    updateDate: '2026-06-27',
    yields: { ytd: 3.8, oneYear: 7.4, threeYear: 1.8, fiveYear: 2.6 },
    allocation: [
      { type: 'Bond', net: 91.4 },
      { type: 'Cash', net: 7.2 },
      { type: 'Other', net: 1.4 },
    ],
    topHoldings: [
      { name: 'Saudi Arabia 4.5% 2046', weight: 1.82 },
      { name: 'Mexico 4.5% 2046', weight: 1.64 },
      { name: 'Indonesia 4.45% 2051', weight: 1.48 },
      { name: 'China 3.25% 2030', weight: 1.36 },
      { name: 'Turkey 6.625% 2045', weight: 1.24 },
      { name: 'Brazil 7.125% 2037', weight: 1.18 },
      { name: 'Qatar 4.0% 2051', weight: 1.12 },
      { name: 'Philippines 3.95% 2040', weight: 0.98 },
      { name: 'Colombia 8.375% 2027', weight: 0.92 },
      { name: 'South Africa 5.875% 2030', weight: 0.86 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'Latin America', pct: 22.4 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Emerging', pct: 10.8 },
        { name: 'Africa / Middle East', pct: 24.6 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Asia Emerging', pct: 32.4 },
        { name: 'Asia Developed', pct: 5.8 },
      ]},
      { group: 'Other', regions: [
        { name: 'North America', pct: 4.0 },
      ]},
    ],
    sectorWeights: [
      { group: 'Sovereign', sectors: [
        { name: 'Government', pct: 62.4 },
        { name: 'Quasi-Sovereign', pct: 18.6 },
      ]},
      { group: 'Corporate', sectors: [
        { name: 'Financial Services', pct: 8.4 },
        { name: 'Energy', pct: 6.2 },
        { name: 'Utilities', pct: 4.4 },
      ]},
    ],
  },

  'IGLO.LSE': {
    name: 'iShares Global Govt Bond UCITS ETF',
    fundFamily: 'BlackRock',
    category: 'Global Government Bond',
    nav: 95.18,
    expenseRatio: 0.0020,
    inceptionDate: '2006-11-28',
    updateDate: '2026-06-27',
    yields: { ytd: 1.4, oneYear: 3.8, threeYear: -1.2, fiveYear: 0.4 },
    allocation: [
      { type: 'Bond', net: 96.8 },
      { type: 'Cash', net: 2.8 },
      { type: 'Other', net: 0.4 },
    ],
    topHoldings: [
      { name: 'US Treasury 4.25% 2025', weight: 2.84 },
      { name: 'US Treasury 3.5% 2028', weight: 2.42 },
      { name: 'US Treasury 3.875% 2030', weight: 2.18 },
      { name: 'Japan 0.5% 2030 JGB', weight: 1.96 },
      { name: 'Germany 2.3% 2033 Bund', weight: 1.74 },
      { name: 'France OAT 0.75% 2028', weight: 1.52 },
      { name: 'UK Gilt 4.25% 2032', weight: 1.38 },
      { name: 'Italy BTP 3.0% 2029', weight: 1.24 },
      { name: 'Spain Bono 3.15% 2030', weight: 1.12 },
      { name: 'Canada 2.75% 2033', weight: 0.98 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 44.8 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Japan', pct: 20.4 },
        { name: 'Asia Developed', pct: 2.2 },
        { name: 'Australasia', pct: 1.8 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 24.6 },
        { name: 'United Kingdom', pct: 6.2 },
      ]},
    ],
    sectorWeights: [
      { group: 'Government', sectors: [
        { name: 'Central Government', pct: 88.4 },
        { name: 'Government-Guaranteed', pct: 6.8 },
        { name: 'Supranational', pct: 4.8 },
      ]},
    ],
  },

  'EWU.US': {
    name: 'iShares MSCI United Kingdom ETF',
    fundFamily: 'BlackRock',
    category: 'United Kingdom Stock',
    nav: 38.14,
    expenseRatio: 0.0050,
    inceptionDate: '1996-03-12',
    updateDate: '2026-06-27',
    yields: { ytd: 9.8, oneYear: 16.2, threeYear: 7.4, fiveYear: 5.8 },
    allocation: [
      { type: 'Non US Stock', net: 96.4 },
      { type: 'Cash', net: 2.8 },
      { type: 'Other', net: 0.8 },
    ],
    topHoldings: [
      { name: 'AstraZeneca PLC', weight: 8.42 },
      { name: 'Shell PLC', weight: 7.18 },
      { name: 'HSBC Holdings PLC', weight: 5.94 },
      { name: 'Unilever PLC', weight: 4.31 },
      { name: 'BP PLC', weight: 3.87 },
      { name: 'GSK PLC', weight: 3.52 },
      { name: 'Rio Tinto PLC', weight: 3.14 },
      { name: 'Diageo PLC', weight: 2.76 },
      { name: 'BAE Systems PLC', weight: 2.48 },
      { name: 'Rolls-Royce Holdings PLC', weight: 2.21 },
    ],
    worldRegions: [
      { group: 'Greater Europe', regions: [
        { name: 'United Kingdom', pct: 95.8 },
        { name: 'Europe Developed', pct: 2.4 },
      ]},
      { group: 'Americas', regions: [
        { name: 'North America', pct: 1.4 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Asia Developed', pct: 0.4 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 6.8 },
        { name: 'Financial Services', pct: 22.4 },
        { name: 'Real Estate', pct: 2.6 },
        { name: 'Basic Materials', pct: 8.2 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 12.4 },
        { name: 'Healthcare', pct: 14.8 },
        { name: 'Utilities', pct: 3.4 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 4.6 },
        { name: 'Energy', pct: 12.8 },
        { name: 'Industrials', pct: 9.6 },
        { name: 'Technology', pct: 2.4 },
      ]},
    ],
  },

  'EZU.US': {
    name: 'iShares MSCI Eurozone ETF',
    fundFamily: 'BlackRock',
    category: 'Europe Stock',
    nav: 54.28,
    expenseRatio: 0.0051,
    inceptionDate: '2000-07-25',
    updateDate: '2026-06-27',
    yields: { ytd: 13.6, oneYear: 18.4, threeYear: 7.2, fiveYear: 6.4 },
    allocation: [
      { type: 'Non US Stock', net: 97.2 },
      { type: 'Cash', net: 2.1 },
      { type: 'Other', net: 0.7 },
    ],
    topHoldings: [
      { name: 'ASML Holding NV', weight: 6.82 },
      { name: 'Novo Nordisk A/S B', weight: 5.14 },
      { name: 'SAP SE', weight: 4.38 },
      { name: 'LVMH Moët Hennessy', weight: 3.94 },
      { name: 'Siemens AG', weight: 3.21 },
      { name: 'Schneider Electric SE', weight: 2.88 },
      { name: 'TotalEnergies SE', weight: 2.64 },
      { name: 'BNP Paribas SA', weight: 2.42 },
      { name: 'Airbus SE', weight: 2.18 },
      { name: 'Allianz SE', weight: 1.96 },
    ],
    worldRegions: [
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 96.8 },
        { name: 'Europe Emerging', pct: 0.8 },
      ]},
      { group: 'Americas', regions: [
        { name: 'North America', pct: 1.6 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Asia Developed', pct: 0.8 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 12.4 },
        { name: 'Financial Services', pct: 18.6 },
        { name: 'Real Estate', pct: 2.2 },
        { name: 'Basic Materials', pct: 6.4 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 8.8 },
        { name: 'Healthcare', pct: 12.6 },
        { name: 'Utilities', pct: 4.8 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 4.2 },
        { name: 'Energy', pct: 6.4 },
        { name: 'Industrials', pct: 14.8 },
        { name: 'Technology', pct: 8.8 },
      ]},
    ],
  },

  'EPP.US': {
    name: 'iShares MSCI Pacific ex Japan ETF',
    fundFamily: 'BlackRock',
    category: 'Pacific/Asia ex-Japan Stock',
    nav: 44.76,
    expenseRatio: 0.0048,
    inceptionDate: '2001-10-25',
    updateDate: '2026-06-27',
    yields: { ytd: 8.2, oneYear: 12.6, threeYear: 4.8, fiveYear: 5.2 },
    allocation: [
      { type: 'Non US Stock', net: 96.8 },
      { type: 'Cash', net: 2.4 },
      { type: 'Other', net: 0.8 },
    ],
    topHoldings: [
      { name: 'BHP Group Ltd', weight: 8.14 },
      { name: 'Commonwealth Bank of Australia', weight: 7.42 },
      { name: 'CSL Ltd', weight: 5.28 },
      { name: 'National Australia Bank Ltd', weight: 4.16 },
      { name: 'Westpac Banking Corp', weight: 3.84 },
      { name: 'ANZ Group Holdings Ltd', weight: 3.52 },
      { name: 'AIA Group Ltd', weight: 3.18 },
      { name: 'Macquarie Group Ltd', weight: 2.94 },
      { name: 'Woolworths Group Ltd', weight: 2.42 },
      { name: 'Rio Tinto Ltd', weight: 2.18 },
    ],
    worldRegions: [
      { group: 'Greater Asia', regions: [
        { name: 'Australasia', pct: 62.4 },
        { name: 'Asia Developed', pct: 34.8 },
        { name: 'Asia Emerging', pct: 1.4 },
      ]},
      { group: 'Americas', regions: [
        { name: 'North America', pct: 0.8 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 0.6 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 5.4 },
        { name: 'Financial Services', pct: 32.8 },
        { name: 'Real Estate', pct: 8.6 },
        { name: 'Basic Materials', pct: 18.4 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 8.2 },
        { name: 'Healthcare', pct: 9.4 },
        { name: 'Utilities', pct: 3.2 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 4.8 },
        { name: 'Energy', pct: 4.6 },
        { name: 'Industrials', pct: 6.8 },
        { name: 'Technology', pct: 1.8 },
      ]},
    ],
  },

  'VT.US': {
    name: 'Vanguard Total World Stock ETF',
    fundFamily: 'Vanguard',
    category: 'World Large-Stock Blend',
    nav: 112.84,
    expenseRatio: 0.0007,
    inceptionDate: '2008-06-24',
    updateDate: '2026-06-27',
    yields: { ytd: 11.4, oneYear: 17.6, threeYear: 8.8, fiveYear: 10.2 },
    allocation: [
      { type: 'Stock', net: 97.4 },
      { type: 'Cash', net: 1.9 },
      { type: 'Other', net: 0.7 },
    ],
    topHoldings: [
      { name: 'Apple Inc', weight: 3.82 },
      { name: 'Microsoft Corp', weight: 3.54 },
      { name: 'Nvidia Corp', weight: 3.21 },
      { name: 'Amazon.com Inc', weight: 2.18 },
      { name: 'Alphabet Inc A', weight: 1.44 },
      { name: 'Meta Platforms Inc A', weight: 1.31 },
      { name: 'Alphabet Inc C', weight: 1.22 },
      { name: 'Taiwan Semiconductor ADR', weight: 0.94 },
      { name: 'Broadcom Inc', weight: 0.88 },
      { name: 'Tesla Inc', weight: 0.81 },
    ],
    worldRegions: [
      { group: 'Americas', regions: [
        { name: 'North America', pct: 61.8 },
        { name: 'Latin America', pct: 1.2 },
      ]},
      { group: 'Greater Europe', regions: [
        { name: 'Europe Developed', pct: 13.4 },
        { name: 'United Kingdom', pct: 3.8 },
        { name: 'Europe Emerging', pct: 0.6 },
      ]},
      { group: 'Greater Asia', regions: [
        { name: 'Japan', pct: 5.6 },
        { name: 'Asia Developed', pct: 3.2 },
        { name: 'Asia Emerging', pct: 8.4 },
        { name: 'Australasia', pct: 1.8 },
      ]},
      { group: 'Middle East / Africa', regions: [
        { name: 'Africa / Middle East', pct: 0.2 },
      ]},
    ],
    sectorWeights: [
      { group: 'Cyclical', sectors: [
        { name: 'Consumer Cyclical', pct: 10.8 },
        { name: 'Financial Services', pct: 15.2 },
        { name: 'Real Estate', pct: 2.8 },
        { name: 'Basic Materials', pct: 3.6 },
      ]},
      { group: 'Defensive', sectors: [
        { name: 'Consumer Defensive', pct: 6.4 },
        { name: 'Healthcare', pct: 11.2 },
        { name: 'Utilities', pct: 2.4 },
      ]},
      { group: 'Sensitive', sectors: [
        { name: 'Communication Services', pct: 8.6 },
        { name: 'Energy', pct: 4.2 },
        { name: 'Industrials', pct: 11.4 },
        { name: 'Technology', pct: 23.4 },
      ]},
    ],
  },

};

export function getMockFundData(symbol: string): NormalisedFundData | null {
  return MOCK[symbol] ?? null;
}

export function isMockSymbol(symbol: string): boolean {
  return symbol in MOCK;
}
