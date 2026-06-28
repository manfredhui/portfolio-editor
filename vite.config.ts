import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'

// ─── TAA Mock Service ────────────────────────────────────────────────────────
// In production this would be a real alpha / risk-model API.
// Here it runs as a Vite server middleware so there is no separate process.

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
  'Risk-On': {
    Equity:       1.8,
    'Fixed Income': -1.6,
    Commodity:    0.9,
    'Real Estate':  0.4,
  },
  'Neutral': {
    Equity:       0.3,
    'Fixed Income': -0.2,
    Commodity:    0.2,
    'Real Estate': -0.1,
  },
  'Risk-Off': {
    Equity:      -1.8,
    'Fixed Income': 1.6,
    Commodity:    0.7,   // gold acts as safe haven
    'Real Estate': -0.6,
  },
}

const REGION_MODIFIER: Record<Signal, Record<string, number>> = {
  'Risk-On': { US: 0.4, Europe: 0.1, Japan: 0.2, EM: 0.6, Global: 0.3 },
  'Neutral': { US: 0.1, Europe: -0.1, Japan: 0.0, EM: 0.2, Global: 0.0 },
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

  // Generate raw signal per asset
  const raw = assets.map(a => {
    const base = classSignals[a.assetClass] ?? 0
    const region = regionMod[a.region] ?? 0
    const noise = (Math.random() - 0.5) * 0.4
    // Scale by weight so large positions get larger absolute tilts
    const scaleFactor = Math.min(a.weight * 0.12, 2.5)
    return { id: a.id, assetClass: a.assetClass, raw: (base + region + noise) * scaleFactor }
  })

  // Normalise so they sum to exactly 0
  const rawSum = raw.reduce((s, r) => s + r.raw, 0)
  const perItem = rawSum / raw.length
  let tilts = raw.map(r => ({ ...r, tilt: Math.round((r.raw - perItem) * 10) / 10 }))

  // Fine-correct rounding drift
  const drift = tilts.reduce((s, t) => s + t.tilt, 0)
  if (Math.abs(drift) >= 0.1) {
    const idx = tilts.reduce((mi, t, i, arr) =>
      Math.abs(t.tilt) > Math.abs(arr[mi].tilt) ? i : mi, 0)
    tilts[idx].tilt = Math.round((tilts[idx].tilt - drift) * 10) / 10
  }

  const results: TiltResult[] = tilts.map(t => {
    const assetClass = assets.find(a => a.id === t.id)?.assetClass ?? ''
    return {
      id: t.id,
      tilt: t.tilt,
      rationale: rationales[assetClass] ?? 'Maintain SAA weight',
    }
  })

  return { signal, tilts: results }
}

function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => { try { resolve(JSON.parse(body)) } catch (e) { reject(e) } })
  })
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'taa-mock-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/taa/suggest' && req.method === 'POST') {
            try {
              const body = await parseBody(req) as { assets: TaaAsset[] }
              if (!Array.isArray(body?.assets) || body.assets.length === 0) {
                sendJson(res, 400, { error: 'assets array required' })
                return
              }
              // Simulate network latency for realism
              await new Promise(r => setTimeout(r, 420))
              const { signal, tilts } = suggestTilts(body.assets)
              sendJson(res, 200, { signal, tilts, timestamp: new Date().toISOString() })
            } catch (e) {
              sendJson(res, 500, { error: String(e) })
            }
            return
          }
          next()
        })
      },
    },
  ],
})
