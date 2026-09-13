'use client';
import { useRef, useState } from 'react';
import { importCsvAction } from '@/app/actions/admin';

export function ImportForm() {
  const ref = useRef(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const run = async (mode) => {
    const file = ref.current?.files?.[0];
    if (!file) return setPreview({ error: 'Choose a CSV file first.' });
    setBusy(true);
    const fd = new FormData(); fd.set('file', file); fd.set('mode', mode);
    const res = await importCsvAction(fd);
    setBusy(false);
    mode === 'preview' ? setPreview(res) : setResult(res);
  };
  return (
    <div className="card space-y-4 p-6" data-testid="import-form">
      <input ref={ref} type="file" accept=".csv,text/csv" className="input !py-2" onChange={() => { setPreview(null); setResult(null); }} data-testid="import-file-input" />
      <div className="flex gap-2"><button disabled={busy} onClick={() => run('preview')} className="btn-ghost !py-2 text-xs" data-testid="import-preview-button">{busy ? 'Reading…' : '1. Preview'}</button><button disabled={busy || !preview?.ok} onClick={() => run('import')} className="btn-brass !py-2 text-xs disabled:opacity-50" data-testid="admin-csv-import-button">2. Import {preview?.ok ? `${preview.total} products` : ''}</button></div>
      {preview?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" data-testid="import-error">{preview.error}</p>}
      {preview?.ok && (
        <div data-testid="import-preview">
          <p className="text-sm font-semibold">{preview.total} valid rows{preview.errors.length ? ` · ${preview.errors.length} skipped` : ''}</p>
          {preview.errors.length > 0 && <ul className="mt-1 max-h-24 overflow-auto text-xs text-red-600">{preview.errors.map((e) => <li key={e}>{e}</li>)}</ul>}
          <div className="mt-3 overflow-x-auto rounded-xl border border-line"><table className="w-full text-xs"><thead className="bg-cream text-left"><tr>{['SKU', 'Name', 'Category', 'Subcategory', 'Author', 'Publisher', 'Price', 'Class', 'Exam'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">{preview.preview.map((r, i) => <tr key={i}><td className="px-3 py-2">{r.sku}</td><td className="px-3 py-2 font-medium">{r.name}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2">{r.subcategory}</td><td className="px-3 py-2">{r.author}</td><td className="px-3 py-2">{r.publisher}</td><td className="px-3 py-2">{r.price}</td><td className="px-3 py-2">{r.className}</td><td className="px-3 py-2">{r.exam}</td></tr>)}</tbody></table></div>
        </div>
      )}
      {result?.ok && <p className="rounded-lg bg-forest-light px-3 py-2 text-sm font-semibold text-forest" data-testid="import-result">Imported: {result.created} created, {result.updated} updated.</p>}
      {result?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p>}
    </div>
  );
}
