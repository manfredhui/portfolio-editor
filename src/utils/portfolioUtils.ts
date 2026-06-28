import { AssetDef, BundleDef, PortfolioNode } from '../types';
import type { TaaAsset } from '../services/taaService';

export function createId(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Weight utils ─────────────────────────────────────────────────────────────

export function computeFolderWeight(node: PortfolioNode): number {
  if (node.nodeType !== 'folder') return node.weight;
  return node.children.reduce((sum, child) => {
    if (child.nodeType === 'folder') return sum + computeFolderWeight(child);
    return sum + (isNaN(child.weight) ? 0 : child.weight);
  }, 0);
}

export function computeEffectiveWeight(node: PortfolioNode): number {
  if (node.nodeType === 'folder') return computeFolderWeight(node);
  return isNaN(node.weight) ? 0 : node.weight;
}

export function getTotalWeight(root: PortfolioNode): number {
  return root.children.reduce((sum, child) => sum + computeEffectiveWeight(child), 0);
}

export function isPortfolioValid(root: PortfolioNode): boolean {
  return Math.abs(getTotalWeight(root) - 100) < 0.001;
}

// ─── Tilt utils ───────────────────────────────────────────────────────────────

// Returns the aggregate tilt for a node:
// - folders: recursive sum of child tilts
// - bundles/assets/abstract: node.tilt (bundle children are not independently tilted)
export function computeNodeTilt(node: PortfolioNode): number {
  if (node.nodeType === 'folder') {
    return node.children.reduce((sum, child) => sum + computeNodeTilt(child), 0);
  }
  return node.tilt ?? 0;
}

export function getTotalTilt(root: PortfolioNode): number {
  return root.children.reduce((sum, child) => sum + computeNodeTilt(child), 0);
}

// Collect all tiltable leaf nodes (skips folders and bundle children)
export function collectTiltableNodes(
  node: PortfolioNode,
  assetDefs: AssetDef[],
  insideBundle = false,
): TaaAsset[] {
  if (node.nodeType === 'folder') {
    return node.children.flatMap(c => collectTiltableNodes(c, assetDefs, false));
  }
  if (insideBundle) return [];
  const def = node.assetId ? assetDefs.find(a => a.id === node.assetId) : null;
  return [{
    id: node.id,
    name: node.name,
    weight: isNaN(node.weight) ? 0 : node.weight,
    assetClass: def?.assetClass ?? 'Unknown',
    region: def?.region ?? 'Global',
  }];
}

// Walk tree and zero every tilt
export function clearAllTilts(node: PortfolioNode): PortfolioNode {
  return { ...node, tilt: 0, children: node.children.map(clearAllTilts) };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function countUnlinkedBenchmarkSlots(node: PortfolioNode): number {
  if (node.nodeType === 'abstract-asset' && !node.linkedAssetId) return 1;
  return node.children.reduce((sum, child) => sum + countUnlinkedBenchmarkSlots(child), 0);
}

// ─── Bundle expansion ─────────────────────────────────────────────────────────

export function expandBundle(bundle: BundleDef, assets: AssetDef[], totalWeight: number): PortfolioNode {
  const children: PortfolioNode[] = bundle.components.map((comp) => {
    const asset = assets.find((a) => a.id === comp.assetId);
    return {
      id: createId(),
      name: asset ? asset.name : comp.assetId,
      nodeType: 'asset',
      weight: (totalWeight * comp.weight) / 100,
      tilt: 0,
      assetId: comp.assetId,
      children: [],
    };
  });
  return {
    id: createId(),
    name: bundle.name,
    nodeType: 'bundle',
    weight: totalWeight,
    tilt: 0,
    bundleId: bundle.id,
    children,
    collapsed: false,
  };
}

export function expandAbstractBundle(bundle: BundleDef, assets: AssetDef[], totalWeight: number): PortfolioNode {
  const children: PortfolioNode[] = bundle.components.map((comp) => {
    const asset = assets.find((a) => a.id === comp.assetId);
    return {
      id: createId(),
      name: asset ? asset.name : comp.assetId,
      nodeType: 'abstract-asset',
      weight: (totalWeight * comp.weight) / 100,
      tilt: 0,
      assetId: comp.assetId,
      children: [],
    };
  });
  return {
    id: createId(),
    name: bundle.name,
    nodeType: 'abstract-bundle',
    weight: totalWeight,
    tilt: 0,
    bundleId: bundle.id,
    children,
    collapsed: false,
  };
}

// ─── Tree traversal ───────────────────────────────────────────────────────────

export function findNode(root: PortfolioNode, id: string): PortfolioNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

export function updateNodeInTree(
  root: PortfolioNode,
  id: string,
  updater: (node: PortfolioNode) => PortfolioNode,
): PortfolioNode {
  if (root.id === id) return updater(root);
  return { ...root, children: root.children.map((child) => updateNodeInTree(child, id, updater)) };
}

export function removeNodeFromTree(root: PortfolioNode, id: string): PortfolioNode {
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== id)
      .map((child) => removeNodeFromTree(child, id)),
  };
}
