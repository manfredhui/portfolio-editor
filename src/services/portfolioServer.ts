import { Portfolio } from '../types';

export interface SavedPortfolioMeta {
  id: string;
  name: string;
  updatedAt: string;
}

export interface ExampleMeta {
  id: string;
  name: string;
  description: string;
}

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res;
}

export async function listExamples(): Promise<ExampleMeta[]> {
  const res = await fetch('/examples/index.json');
  return res.json() as Promise<ExampleMeta[]>;
}

export async function loadExample(id: string): Promise<Portfolio> {
  const res = await fetch(`/examples/${id}.json`);
  return res.json() as Promise<Portfolio>;
}

export async function listSaved(): Promise<SavedPortfolioMeta[]> {
  const res = await apiFetch('/api/portfolios');
  return res.json() as Promise<SavedPortfolioMeta[]>;
}

export async function saveToServer(portfolio: Portfolio): Promise<string> {
  const res = await apiFetch('/api/portfolios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...portfolio, updatedAt: new Date().toISOString() }),
  });
  const data = await res.json() as { id: string };
  return data.id;
}

export async function loadFromServer(id: string): Promise<Portfolio> {
  const res = await apiFetch(`/api/portfolios/${id}`);
  return res.json() as Promise<Portfolio>;
}

export async function deleteFromServer(id: string): Promise<void> {
  await apiFetch(`/api/portfolios/${id}`, { method: 'DELETE' });
}
