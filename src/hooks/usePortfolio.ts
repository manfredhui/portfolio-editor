import { create } from 'zustand';
import { AssetLibrary, Portfolio, PortfolioNode } from '../types';
import assetsData from '../data/assets.json';
import { samplePortfolio } from '../data/samplePortfolio';
import {
  createId,
  expandBundle,
  expandAbstractBundle,
  updateNodeInTree,
  removeNodeFromTree,
  findNode,
  clearAllTilts,
} from '../utils/portfolioUtils';

interface PortfolioStore {
  portfolio: Portfolio | null;
  assetLibrary: AssetLibrary;
  allowAbstractAssets: boolean;
  setAllowAbstractAssets: (v: boolean) => void;
  newPortfolio: (name: string) => void;
  loadPortfolio: (p: Portfolio) => void;
  addFolder: (parentId: string, name: string) => void;
  addAsset: (parentId: string, assetId: string, weight: number) => void;
  addBundle: (parentId: string, bundleId: string, totalWeight: number) => void;
  addAbstractBundle: (parentId: string, bundleId: string, totalWeight: number) => void;
  updateWeight: (nodeId: string, weight: number) => void;
  linkAbstractAsset: (nodeId: string, realAssetId: string) => void;
  removeNode: (nodeId: string) => void;
  toggleCollapse: (nodeId: string) => void;
  renameNode: (nodeId: string, name: string) => void;
  // TAA tilt actions
  updateTilt: (nodeId: string, tilt: number) => void;
  resetTilts: () => void;
  applyTilts: (tilts: { id: string; tilt: number }[]) => void;
}

const assetLibrary: AssetLibrary = assetsData as AssetLibrary;

function addChildToParent(root: PortfolioNode, parentId: string, child: PortfolioNode): PortfolioNode {
  return updateNodeInTree(root, parentId, (node) => ({
    ...node,
    children: [...node.children, child],
  }));
}

function recomputeBundleChildWeights(
  root: PortfolioNode,
  bundleNodeId: string,
  oldWeight: number,
  newWeight: number,
): PortfolioNode {
  return updateNodeInTree(root, bundleNodeId, (node) => ({
    ...node,
    weight: newWeight,
    children: node.children.map((child) => ({
      ...child,
      weight: oldWeight > 0 ? (child.weight / oldWeight) * newWeight : child.weight,
    })),
  }));
}

export const usePortfolio = create<PortfolioStore>((set, get) => ({
  portfolio: samplePortfolio,
  assetLibrary,
  allowAbstractAssets: false,
  setAllowAbstractAssets: (v) => set({ allowAbstractAssets: v }),

  newPortfolio: (name: string) => {
    const now = new Date().toISOString();
    const portfolio: Portfolio = {
      id: createId(),
      name,
      createdAt: now,
      updatedAt: now,
      root: { id: createId(), name: 'Portfolio Root', nodeType: 'folder', weight: NaN, tilt: 0, children: [] },
    };
    set({ portfolio });
  },

  loadPortfolio: (p: Portfolio) => {
    set({ portfolio: p });
  },

  addFolder: (parentId, name) => {
    const { portfolio } = get();
    if (!portfolio) return;
    const child: PortfolioNode = {
      id: createId(), name, nodeType: 'folder', weight: NaN, tilt: 0, children: [], collapsed: false,
    };
    set({ portfolio: { ...portfolio, root: addChildToParent(portfolio.root, parentId, child), updatedAt: new Date().toISOString() } });
  },

  addAsset: (parentId, assetId, weight) => {
    const { portfolio, assetLibrary } = get();
    if (!portfolio) return;
    const assetDef = assetLibrary.assets.find((a) => a.id === assetId);
    if (!assetDef) return;
    const child: PortfolioNode = {
      id: createId(), name: assetDef.name, nodeType: 'asset', weight, tilt: 0, assetId, children: [],
    };
    set({ portfolio: { ...portfolio, root: addChildToParent(portfolio.root, parentId, child), updatedAt: new Date().toISOString() } });
  },

  addBundle: (parentId, bundleId, totalWeight) => {
    const { portfolio, assetLibrary } = get();
    if (!portfolio) return;
    const bundleDef = assetLibrary.bundles.find((b) => b.id === bundleId);
    if (!bundleDef) return;
    const bundleNode = expandBundle(bundleDef, assetLibrary.assets, totalWeight);
    set({ portfolio: { ...portfolio, root: addChildToParent(portfolio.root, parentId, bundleNode), updatedAt: new Date().toISOString() } });
  },

  addAbstractBundle: (parentId, bundleId, totalWeight) => {
    const { portfolio, assetLibrary } = get();
    if (!portfolio) return;
    const bundleDef = assetLibrary.bundles.find((b) => b.id === bundleId);
    if (!bundleDef) return;
    const bundleNode = expandAbstractBundle(bundleDef, assetLibrary.assets, totalWeight);
    set({ portfolio: { ...portfolio, root: addChildToParent(portfolio.root, parentId, bundleNode), updatedAt: new Date().toISOString() } });
  },

  updateWeight: (nodeId, weight) => {
    const { portfolio } = get();
    if (!portfolio) return;
    const node = findNode(portfolio.root, nodeId);
    if (!node) return;
    let newRoot: PortfolioNode;
    if (node.nodeType === 'bundle' || node.nodeType === 'abstract-bundle') {
      newRoot = recomputeBundleChildWeights(portfolio.root, nodeId, node.weight, weight);
    } else {
      newRoot = updateNodeInTree(portfolio.root, nodeId, (n) => ({ ...n, weight }));
    }
    set({ portfolio: { ...portfolio, root: newRoot, updatedAt: new Date().toISOString() } });
  },

  linkAbstractAsset: (nodeId, realAssetId) => {
    const { portfolio } = get();
    if (!portfolio) return;
    const newRoot = updateNodeInTree(portfolio.root, nodeId, (node) => ({ ...node, linkedAssetId: realAssetId }));
    set({ portfolio: { ...portfolio, root: newRoot, updatedAt: new Date().toISOString() } });
  },

  removeNode: (nodeId) => {
    const { portfolio } = get();
    if (!portfolio) return;
    const newRoot = removeNodeFromTree(portfolio.root, nodeId);
    set({ portfolio: { ...portfolio, root: newRoot, updatedAt: new Date().toISOString() } });
  },

  toggleCollapse: (nodeId) => {
    const { portfolio } = get();
    if (!portfolio) return;
    const newRoot = updateNodeInTree(portfolio.root, nodeId, (node) => ({ ...node, collapsed: !node.collapsed }));
    set({ portfolio: { ...portfolio, root: newRoot, updatedAt: new Date().toISOString() } });
  },

  renameNode: (nodeId, name) => {
    const { portfolio } = get();
    if (!portfolio) return;
    const newRoot = updateNodeInTree(portfolio.root, nodeId, (node) => ({ ...node, name }));
    set({ portfolio: { ...portfolio, root: newRoot, updatedAt: new Date().toISOString() } });
  },

  updateTilt: (nodeId, tilt) => {
    const { portfolio } = get();
    if (!portfolio) return;
    const rounded = Math.round(tilt * 10) / 10;
    const newRoot = updateNodeInTree(portfolio.root, nodeId, (n) => ({ ...n, tilt: rounded }));
    set({ portfolio: { ...portfolio, root: newRoot, updatedAt: new Date().toISOString() } });
  },

  resetTilts: () => {
    const { portfolio } = get();
    if (!portfolio) return;
    const newRoot = clearAllTilts(portfolio.root);
    set({ portfolio: { ...portfolio, root: newRoot, updatedAt: new Date().toISOString() } });
  },

  applyTilts: (tilts) => {
    const { portfolio } = get();
    if (!portfolio) return;
    let newRoot = portfolio.root;
    for (const { id, tilt } of tilts) {
      newRoot = updateNodeInTree(newRoot, id, (n) => ({ ...n, tilt: Math.round(tilt * 10) / 10 }));
    }
    set({ portfolio: { ...portfolio, root: newRoot, updatedAt: new Date().toISOString() } });
  },
}));
