export interface TaaAsset {
  id: string;
  name: string;
  weight: number;
  assetClass: string;
  region: string;
}

export interface TiltSuggestion {
  id: string;
  tilt: number;
  rationale: string;
}

export interface TaaResponse {
  signal: 'Risk-On' | 'Neutral' | 'Risk-Off';
  tilts: TiltSuggestion[];
  timestamp: string;
}

export async function fetchTaaSuggestions(assets: TaaAsset[]): Promise<TaaResponse> {
  const res = await fetch('/api/taa/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assets }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `TAA API ${res.status}`);
  }
  return res.json();
}
