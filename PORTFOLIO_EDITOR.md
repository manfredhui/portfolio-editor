# Portfolio Editor — Design Document

## 1. Overview and Purpose

Portfolio Editor is a browser-based tool for constructing and visualising investment portfolio trees. Users can compose a portfolio from concrete ETFs, abstract allocation slots, pre-built bundles, and nested folders, all while tracking absolute percentage weights in real time. Finished portfolios can be saved as JSON and reloaded later.

## 2. Core Concepts

### Portfolio Tree

A portfolio is represented as a tree of nodes rooted at a single folder. Every node except the root carries an absolute portfolio weight (e.g. 30.5 means 30.5% of the total portfolio). The tree can be arbitrarily nested using folders, and any folder or the root can contain assets, bundles, and abstract bundles as direct children.

### Weight Model

All leaf nodes (assets and bundle-instances) store **absolute portfolio weights** — a direct percentage of the total portfolio. Folder weights are derived by summing the absolute weights of all leaf descendants, not stored. The portfolio is considered valid when all top-level absolute weights sum to exactly 100%.

### Node Types

| Type | Description |
|------|-------------|
| `folder` | Logical grouping; weight is computed from children |
| `asset` | A concrete investment (e.g. an ETF); has a user-set absolute weight |
| `bundle` | A named preset allocation; its children's weights are computed from the bundle's total weight |
| `abstract-bundle` | Like a bundle but slots reference abstract assets that must be linked to real ones |
| `abstract-asset` | A placeholder inside an abstract bundle; must be linked to a concrete asset |

## 3. Asset Types

### Concrete Assets

Concrete assets are real, tradable instruments (ETFs in the seed data). They have a ticker symbol and can be added directly to any folder or the portfolio root with a user-specified absolute weight.

### Abstract Assets

Abstract assets are allocation slots that represent a *category* of investment (e.g. "US Equity Allocation") without pinning a specific instrument. They are primarily used as components inside abstract bundles, and each one must be linked to a concrete asset before the portfolio can be considered fully specified.

## 4. Bundle Types

### Concrete Bundle

A concrete bundle is a named preset with fixed relative component weights that sum to 100%. When added to the portfolio the user sets a total absolute weight; each component's absolute weight is then `total_weight × component_relative% / 100`. The component rows are read-only inside the tree (shown with a lock icon) because their weights are derived from the bundle total.

### Abstract Bundle

An abstract bundle follows the same structure as a concrete bundle but its components are abstract assets. This lets users work with an allocation *template* (e.g. MSCI World) and link real funds to each slot independently. The linking can be done inline from the tree via a dropdown on each abstract-asset row.

## 5. How Abstract Assets Work — The Linking Mechanism

1. An abstract bundle is added to the portfolio with a total weight.
2. Each component (an abstract-asset node) receives a computed absolute weight.
3. In the tree, each abstract-asset row shows a **Link asset** dropdown populated with all concrete assets from the library.
4. Selecting a concrete asset stores its id in `linkedAssetId` on the node.
5. Once linked the row displays a green badge showing the linked ticker.
6. Linking is purely informational in the current model — it does not change weights.

## 6. Weight Calculation

### Absolute Weights

Every asset and bundle node stores an `weight` field that is an absolute portfolio percentage. The user edits this value directly for asset nodes. For bundle nodes the user edits the bundle total; the children are recomputed automatically.

### Folder Derived Weights

A folder's displayed weight is computed recursively:

```
folderWeight(node) = Σ weight(child) for each direct child
```

where each child's weight is either its stored absolute weight (asset/bundle) or its recursively computed folder weight.

### Bundle Computed Component Weights

When a bundle's total weight changes from `old` to `new`, each child's weight is scaled proportionally:

```
child.weight = (child.weight / old) × new
```

This preserves the relative split defined in the bundle template. When a bundle is first expanded the initial absolute weights are:

```
child.weight = bundle_total_weight × component_relative% / 100
```

## 7. Validation Rules

- The portfolio is valid when `|Σ top-level-leaf-weights − 100| < 0.001`.
- An invalid portfolio shows a red validation banner above the tree, describing whether the total is over or under.
- The header badge turns red when invalid and green when valid.
- There is no hard block on saving an invalid portfolio; the user can save and reload at any stage.

## 8. UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: logo | portfolio name (editable) | weight badge | buttons
├──────────────┬──────────────────────────────────────────────┤
│ Asset Library│  Portfolio Tree                              │
│  (280 px)    │  [validation banner if needed]               │
│              │  [root add buttons]                          │
│  Search box  │  ┌─ tree header row ─────────────────────── │
│              │  │ Name | Type | Weight | Eff.% | Bar | Act  │
│  Concrete    │  ├───────────────────────────────────────────│
│  Assets      │  │ folder row                               │
│              │  │   asset row                              │
│  Abstract    │  │   bundle row (expandable)                │
│  Assets      │  │     bundle-child row (lock icon)         │
│              │  │   abstract-bundle row                    │
│  Bundles     │  │     abstract-asset row + link dropdown   │
│              │  ├───────────────────────────────────────────│
│  Abstract    │  │ Total footer row                         │
│  Bundles     │  └───────────────────────────────────────────│
└──────────────┴──────────────────────────────────────────────┘
```

Each tree row has columns: expand toggle, name, type badge, editable weight, effective %, proportional weight bar, action buttons.

## 9. Data Format (JSON Schema)

A saved portfolio file is a plain JSON object:

```json
{
  "id": "string",
  "name": "string",
  "createdAt": "ISO-8601 string",
  "updatedAt": "ISO-8601 string",
  "root": {
    "id": "string",
    "name": "string",
    "nodeType": "folder | asset | bundle | abstract-bundle | abstract-asset",
    "weight": "number (NaN serialises as null for folders)",
    "assetId": "string (optional)",
    "bundleId": "string (optional)",
    "linkedAssetId": "string (optional)",
    "collapsed": "boolean (optional)",
    "children": [ ...recursive PortfolioNode... ]
  }
}
```

The asset library (`src/data/assets.json`) is bundled separately and is never embedded in saved portfolio files; it is loaded at application startup.

## 10. How to Run

```bash
cd portfolio-editor
npm install
npm run dev
```

The dev server starts on `http://localhost:5173` by default.

To build for production:

```bash
npm run build
npm run preview
```

## 11. Possible Extensions

- **Drag-and-drop reordering** of nodes within the tree.
- **Undo/redo** via a command stack on top of the Zustand store.
- **Live price integration** — fetch NAV/price from a market data API and display portfolio value.
- **Risk analytics** — volatility, correlation, VaR overlays on each node.
- **Export to Excel/CSV** — flat list of leaf holdings with weights.
- **Multi-portfolio comparison** — open two portfolios side by side and diff their weights.
- **Abstract bundle validation** — flag unlinked abstract assets and prevent saving until all are resolved.
- **Relative weight mode** — toggle between absolute and relative (percent-of-parent) views.
- **Constraints engine** — min/max weight rules per asset class, region, or node type with visual violation indicators.
