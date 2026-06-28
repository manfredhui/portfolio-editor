import { Portfolio } from '../types';

export function savePortfolio(portfolio: Portfolio): void {
  const json = JSON.stringify(portfolio, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${portfolio.name.replace(/\s+/g, '_')}.portfolio.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function loadPortfolio(file: File): Promise<Portfolio> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const portfolio = JSON.parse(text) as Portfolio;
        resolve(portfolio);
      } catch {
        reject(new Error('Invalid portfolio file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
