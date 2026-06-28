type Signal = 'Risk-On' | 'Neutral' | 'Risk-Off'

interface TaaAsset {
  id: string
  name: string
  weight: number
  assetClass: string
  region: string
}

interface TiltResult {
  id: string
  tilt: number
  rationale: string
}

const ASSET_CLASS_SIGNALS: Record<Signal, Record<string, number>> = {
  'Risk-On': { Equity: 1.8, 'Fixed Income': -1.6, Commodity: 0.9, 'Real Estate': 0.4 },
  'Neutral':  { Equity: 0.3, 'Fixed Income': -0.2, Commodity: 0.2, 'Real Estate': -0.1 },
  'Risk-Off': { Equity: -1.8, 'Fixed Income': 1.6, Commodity: 0.7, 'Real Estate': -0.6 },
}

const REGION_MODIFIER: Record<Signal, Record<string, number>> = {
  'Risk-On': { US: 0.4, Europe: 0.1, Japan: 0.2, EM: 0.6, Global: 0.3 },
  'Neutral':  { US: 0.1, Europe: -0.1, Japan: 0.0, EM: 0.2, Global: 0.0 },
  'Risk-Off': { US: -0.2, Europe: -0.4, Japan: -0.3, EM: -0.8, Global: -0.3 },
}

const RATIONALES: Record<Signal, Record<string, string>> = {
  'Risk-On': {
    Equity: 'Overweight — strong momentum & earnings beat expectations',
    'Fixed Income': 'Underweight — rising yields reduce duration attractiveness',
    Commodity: 'Overweight — reflation trade & supply constraints',
    'Real Estate': 'Slight overweight — yield compression supportive',
  },
  'Neutral': {
    Equity: 'Neutral — mixed signals, maintaining SAA weight',
    'Fixed Income': 'Slight underweight — yield curve flattening',
    Commodity: 'Slight overweight — geopolitical risk premium',
    'Real Estate': 'Neutral — rate sensitivity balanced by income',
  },
  'Risk-Off': {
    Equity: 'Underweight — recession risk elevated, tighten positioning',
    'Fixed Income': 'Overweight — flight to quality, duration attractive',
    Commodity: 'Gold overweight — safe-haven demand; energy underweight',
    'Real Estate': 'Underweight — credit spread widening hurts REITs',
  },
}

function pickSignal(): Signal {
  const r = Math.random()
  if (r < 0.40) return 'Risk-On'
  if (r < 0.70) return 'Neutral'
  return 'Risk-Off'
}

function suggestTilts(assets: TaaAsset[]): { signal: Signal; tilts: TiltResult[] } {
  const signal = pickSignal()
  const classSignals = ASSET_CLASS_SIGNALS[signal]
  const regionMod = REGION_MODIFIER[signal]
  const rationales = RATIONALES[signal]

  const raw = assets.map(a => {
    const base = classSignals[a.assetClass] ?? 0
    const region = regionMod[a.region] ?? 0
    const noise = (Math.random() - 0.5) * 0.4
    const scaleFactor = Math.min(a.weight * 0.12, 2.5)
    return { id: a.id, assetClass: a.assetClass, raw: (base + region + noise) * scaleFactor }
  })

  const rawSum = raw.reduce((s, r) => s + r.raw, 0)
  const perItem = rawSum / raw.length
  const tilts = raw.map(r => ({ ...r, tilt: Math.round((r.raw - perItem) * 10) / 10 }))

  const drift = tilts.reduce((s, t) => s + t.tilt, 0)
  if (Math.abs(drift) >= 0.1) {
    const idx = tilts.reduce((mi, t, i, arr) =>
      Math.abs(t.tilt) > Math.abs(arr[mi].tilt) ? i : mi, 0)
    tilts[idx].tilt = Math.round((tilts[idx].tilt - drift) * 10) / 10
  }

  const results: TiltResult[] = tilts.map(t => ({
    id: t.id,
    tilt: t.tilt,
    rationale: rationales[assets.find(a => a.id === t.id)?.assetClass ?? ''] ?? 'Maintain SAA weight',
  }))

  return { signal, tilts: results }
}

export const handler = async (event: { httpMethod: string; body: string | null }) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const body = JSON.parse(event.body ?? '{}') as { assets?: TaaAsset[] }
    if (!Array.isArray(body?.assets) || body.assets.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'assets array required' }) }
    }
    const { signal, tilts } = suggestTilts(body.assets)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ signal, tilts, timestamp: new Date().toISOString() }),
    }
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(e) }) }
  }
}
