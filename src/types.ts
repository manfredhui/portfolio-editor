export type NodeType = 'folder' | 'asset' | 'bundle' | 'abstract-bundle' | 'abstract-asset';

export interface PortfolioNode {
  id: string;
  name: string;
  nodeType: NodeType;
  weight: number;
  tilt?: number;
  assetId?: string;
  bundleId?: string;
  linkedAssetId?: string;
  children: PortfolioNode[];
  collapsed?: boolean;
}

export interface Portfolio {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  root: PortfolioNode;
}

export interface AssetDef {
  id: string;
  name: string;
  type: 'concrete' | 'abstract';
  ticker?: string;
  eodhdSymbol?: string;
  assetClass: string;
  region: string;
  description: string;
}

export interface BundleComponent {
  assetId: string;
  weight: number;
}

export interface BundleDef {
  id: string;
  name: string;
  type: 'bundle' | 'abstract-bundle';
  description: string;
  components: BundleComponent[];
}

export interface AssetLibrary {
  assets: AssetDef[];
  bundles: BundleDef[];
}
