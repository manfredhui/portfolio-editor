import { create } from 'zustand';

interface ExposurePanelState {
  selectedAssetId: string | null;
  apiToken: string;
  open: (assetId: string) => void;
  close: () => void;
  setApiToken: (token: string) => void;
}

export const useExposurePanel = create<ExposurePanelState>((set) => ({
  selectedAssetId: null,
  apiToken: 'demo',
  open: (assetId) => set({ selectedAssetId: assetId }),
  close: () => set({ selectedAssetId: null }),
  setApiToken: (token) => set({ apiToken: token }),
}));
