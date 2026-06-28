# Portfolio Editor

A browser-based portfolio construction tool for building, editing, and tactically tilting investment portfolios. Designed for portfolio managers and analysts who want to model strategic asset allocations (SAA) and overlay tactical tilts (TAA) without leaving the browser.

---

## Features

### Portfolio Tree
- Portfolios are represented as a **tree** starting from a root node
- Supports four node types: **Folders**, **Assets**, **Models**, and **Benchmarks**
- Weights are **absolute** — each leaf holds its actual portfolio percentage; folder weight is the sum of its children
- Inline weight editing with 0.1% increments
- Double-click any node name to rename it
- Collapse/expand folders and model groups
- Drag-free tree with visual connectors showing hierarchy depth

### Folders
- Group related assets (e.g. "Equity", "Fixed Income")
- Folder weight is computed automatically as the sum of all children
- Can contain assets, models, benchmarks, and sub-folders

### Models (Bundles)
- Pre-defined asset mixes from the asset library (e.g. "Global Equity Model", "Balanced 60/40")
- Adding a model to the tree **auto-expands** it into weighted child nodes
- Example: adding a 10% allocation to a 40/60 model creates two children at 4% and 6%
- Child weights are locked and proportionally rescaled when the model's total weight changes

### Benchmarks (Abstract Bundles)
- Like models, but each child is a **benchmark slot** — a placeholder for a real asset
- Used to represent index benchmarks (e.g. MSCI World by region, Global Multi-Asset)
- Each slot must be **linked** to a concrete asset from the library before the portfolio is considered complete
- The **Allow Benchmark Slots** toggle (header) controls whether unlinked slots block validation or are allowed through

### Asset Library (left panel)
- **Concrete Assets** — 12 real ETFs and funds with tickers and EODHD symbols
- **Benchmark Slots** — 6 abstract placeholders (US Equity, European Equity, Japan Equity, EM Equity, Fixed Income, MSCI World)
- **Models** — 3 pre-built concrete bundles: Global Equity, Balanced 60/40, All Weather
- **Benchmarks** — 3 pre-built abstract bundles: MSCI World (Regions), MSCI World (Benchmark), Global Multi-Asset

### Exposure Panel
- Click 📊 on any asset node to open a slide-in panel with fund data
- Four tabs: **Allocation** (stocks/bonds/cash/other), **Holdings** (top positions), **Regions**, **Sectors**
- `SWPPX.US` fetches live data from EODHD's free API endpoint
- All other assets return realistic mock data so the demo works without an API key
- Live vs mock is clearly badged in the panel footer

### TAA Tilt Column
- Every non-folder, non-model-child row has an editable **Tilt** column
- Tilts are positive (overweight) or negative (underweight) in percentage points
- Folder rows show the **aggregate tilt** of all children (read-only)
- The footer shows a **Tilt sum** indicator — must be 0% for a balanced overlay
- **↺ Reset** — zeros all tilts in one click
- **✦ Suggest** — calls the TAA mock API, which returns a market signal and suggested tilts; applies them to the tree instantly
- Signal badge shows the regime returned: `Risk-On`, `Neutral`, or `Risk-Off`

### Load / Save
- **Save** exports the current portfolio as a JSON file
- **Load** imports a previously saved JSON file
- **New** creates a blank portfolio

---

## Asset Library Contents

| Ticker | Name | Class | Region | EODHD Symbol |
|--------|------|-------|--------|--------------|
| VTI | Vanguard Total Stock Market ETF | Equity | US | SWPPX.US (demo) |
| VGK | Vanguard FTSE Europe ETF | Equity | Europe | VGK.US |
| EWJ | iShares MSCI Japan ETF | Equity | Japan | EWJ.US |
| VWO | Vanguard FTSE Emerging Markets ETF | Equity | EM | VWO.US |
| QQQ | Invesco QQQ (Nasdaq-100) | Equity | US | QQQ.US |
| TLT | iShares 20+ Year Treasury Bond ETF | Fixed Income | US | TLT.US |
| IEAG | iShares Core € Aggregate Bond ETF | Fixed Income | Europe | IEAG.LSE |
| TIP | iShares TIPS Bond ETF | Fixed Income | US | TIP.US |
| HYG | iShares iBoxx $ High Yield Corporate Bond ETF | Fixed Income | US | HYG.US |
| GLD | SPDR Gold Shares | Commodity | Global | GLD.US |
| VNQ | Vanguard Real Estate ETF | Real Estate | US | VNQ.US |
| BCI | abrdn Bloomberg All Commodity Longer Dated Strategy K-1 Free ETF | Commodity | Global | BCI.US |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| State management | Zustand |
| Styling | Plain CSS (no framework) |
| Fund data API | EODHD (`/api/fundamentals/{symbol}`) |
| TAA mock API | Vite server middleware (dev) / Netlify Function (prod) |
| Hosting | Netlify (static site + serverless function) |

---

## Project Structure

```
portfolio-editor/
├── netlify/
│   └── functions/
│       └── taa-suggest.ts      # TAA mock API (production serverless function)
├── src/
│   ├── components/
│   │   ├── AssetLibrary.tsx    # Left panel — browse and add assets/models/benchmarks
│   │   ├── Dialogs.tsx         # Add asset / add model / add folder modal dialogs
│   │   ├── ExposurePanel.tsx   # Slide-in fund data panel (allocation, holdings, regions, sectors)
│   │   ├── Header.tsx          # Top bar — portfolio name, save/load/new, benchmark toggle
│   │   ├── PortfolioTree.tsx   # Main tree view — column headers, footer totals, TAA controls
│   │   └── TreeNode.tsx        # Individual tree row — weight, tilt, actions, inline editing
│   ├── data/
│   │   ├── assets.json         # Asset library definition (assets + bundles)
│   │   └── samplePortfolio.ts  # Default portfolio loaded on first launch
│   ├── hooks/
│   │   ├── useExposurePanel.ts # State for the exposure slide-in panel
│   │   └── usePortfolio.ts     # Zustand store — all portfolio state and actions
│   ├── services/
│   │   ├── eodhdService.ts     # Fetch fund data (routes to mock or live EODHD)
│   │   ├── mockFundData.ts     # Realistic mock fund data for all non-demo symbols
│   │   └── taaService.ts       # Client call to POST /api/taa/suggest
│   ├── utils/
│   │   ├── fileUtils.ts        # JSON load/save helpers
│   │   └── portfolioUtils.ts   # Tree traversal, weight/tilt computation, bundle expansion
│   ├── types.ts                # Core TypeScript interfaces
│   ├── App.css                 # All styles
│   └── App.tsx                 # Root component and layout
├── netlify.toml                # Netlify build config and API redirect
├── vite.config.ts              # Vite config + TAA mock middleware (dev only)
├── tsconfig.json
└── package.json
```

---

## Running Locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. The TAA mock API is served by the Vite dev server middleware at `POST /api/taa/suggest` — no separate process needed.

---

## Deploying to Netlify

The repo includes `netlify.toml` which configures everything automatically.

### Option A — Connect GitHub (recommended, enables auto-deploy)

1. Log in to [netlify.com](https://netlify.com)
2. **Add new site → Import from Git → GitHub**
3. Select the `portfolio-editor` repo
4. Build settings are pre-filled from `netlify.toml` — just click **Deploy**

Every push to `main` will trigger a new deployment automatically.

### Option B — Manual deploy via CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### How the API works in production

In development the TAA endpoint is a Vite middleware. In production Netlify routes `POST /api/taa/suggest` to `netlify/functions/taa-suggest.ts`, which runs as a serverless function. The redirect is defined in `netlify.toml`:

```toml
[[redirects]]
  from = "/api/taa/suggest"
  to   = "/.netlify/functions/taa-suggest"
  status = 200
  force  = true
```

---

## TAA Mock API

`POST /api/taa/suggest`

**Request**
```json
{
  "assets": [
    { "id": "node-id", "name": "VTI", "weight": 40, "assetClass": "Equity", "region": "US" }
  ]
}
```

**Response**
```json
{
  "signal": "Risk-On",
  "tilts": [
    { "id": "node-id", "tilt": 1.2, "rationale": "Overweight — strong momentum & earnings beat expectations" }
  ],
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

The mock algorithm:
1. Randomly picks a market signal (40% Risk-On, 30% Neutral, 30% Risk-Off)
2. Applies asset-class and region lookup tables to generate a raw signal per node
3. Scales by position size (larger positions get larger absolute tilts)
4. Normalises so tilts sum to exactly 0% (sum-to-zero constraint)
5. Fine-corrects rounding drift by adjusting the largest-tilt node

---

## Key Concepts

**Absolute vs relative weights** — weights are stored as direct portfolio percentages, not relative to siblings. Adding two 10% equity funds gives 20% equity exposure. The portfolio is valid when all top-level weights sum to 100%.

**Bundle expansion** — when a model is added, it immediately expands into concrete child nodes with proportional weights. The children are locked; editing the model's total weight rescales all children proportionally.

**Abstract assets / Benchmark Slots** — cannot be invested in directly. They must be linked to a concrete asset via the dropdown in each row. The link is used for exposure data lookups and portfolio validation.

**Tilt overlay** — tilts are additive adjustments on top of SAA weights. Effective weight = SAA weight + tilt. The sum of all tilts must equal 0% so the total portfolio remains at 100%.
