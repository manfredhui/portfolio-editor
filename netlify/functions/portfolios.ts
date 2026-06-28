import { getStore } from '@netlify/blobs';

const STORE = 'portfolios';
const JSON_HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

export default async (req: Request, context: { params: Record<string, string> }) => {
  const store = getStore(STORE);
  const id = context.params.id as string | undefined;

  // List all saved portfolios
  if (req.method === 'GET' && !id) {
    const { blobs } = await store.list({ expand: 'metadata' });
    const list = blobs.map((b) => ({
      id: b.key,
      name: (b.metadata?.name as string) ?? b.key,
      updatedAt: (b.metadata?.updatedAt as string) ?? '',
    }));
    return json(list);
  }

  // Load a specific portfolio
  if (req.method === 'GET' && id) {
    const data = await store.get(id);
    if (!data) return new Response('Not found', { status: 404, headers: JSON_HEADERS });
    return new Response(data, { headers: JSON_HEADERS });
  }

  // Save (create or overwrite) a portfolio
  if (req.method === 'POST') {
    const body = await req.text();
    let portfolio: { id?: string; name?: string; updatedAt?: string };
    try { portfolio = JSON.parse(body); } catch { return json({ error: 'Invalid JSON' }, 400); }
    const saveId = portfolio.id ?? crypto.randomUUID();
    await store.set(saveId, body, {
      metadata: { name: portfolio.name ?? saveId, updatedAt: portfolio.updatedAt ?? new Date().toISOString() },
    });
    return json({ id: saveId });
  }

  // Delete a portfolio
  if (req.method === 'DELETE' && id) {
    await store.delete(id);
    return new Response(null, { status: 204 });
  }

  return json({ error: 'Method not allowed' }, 405);
};

export const config = {
  path: ['/api/portfolios', '/api/portfolios/:id'],
};
