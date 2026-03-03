// src/components/CsvUploader.jsx
import { useState } from 'react';
import Papa from 'papaparse';
import { autoDetectMapping, mapRowToTransaction } from '../utils/csvMapper';

export function CsvUploader({ onImport }) {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [preview, setPreview] = useState([]);
  const [mapping, setMapping] = useState({ date: null, description: null, amount: null, category: null });
  const [showMapping, setShowMapping] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);

    Papa.parse(file, {
      header: true,
      preview: 5, // just parse first 5 rows for preview
      complete: (result) => {
        setHeaders(result.meta.fields);
        setPreview(result.data);
        const detected = autoDetectMapping(result.meta.fields);
        setMapping(detected);
        setShowMapping(true);
      },
    });
  };

  const handleMappingChange = (field, index) => {
    setMapping(prev => ({ ...prev, [field]: index === '' ? null : parseInt(index) }));
  };

  const handleImport = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const transactions = result.data
          .filter(row => row[headers[0]]?.trim()) // filter empty rows
          .map(row => mapRowToTransaction(row, mapping))
          .filter(t => t.amount !== 0); // ignore zero-amount rows
        onImport(transactions);
        setShowMapping(false);
        setFile(null);
        // reset file input
        document.getElementById('csv-file').value = '';
      },
    });
  };

  return (
    <div className="border rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">Import from CSV</h3>
      <input
        id="csv-file"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-2"
      />

      {showMapping && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Map CSV columns to transaction fields:</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-sm">Date column:</label>
              <select
                value={mapping.date ?? ''}
                onChange={(e) => handleMappingChange('date', e.target.value)}
                className="border rounded p-1 w-full"
              >
                <option value="">-- Select --</option>
                {headers.map((h, i) => (
                  <option key={i} value={i}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Description column:</label>
              <select
                value={mapping.description ?? ''}
                onChange={(e) => handleMappingChange('description', e.target.value)}
                className="border rounded p-1 w-full"
              >
                <option value="">-- Select --</option>
                {headers.map((h, i) => (
                  <option key={i} value={i}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Amount column:</label>
              <select
                value={mapping.amount ?? ''}
                onChange={(e) => handleMappingChange('amount', e.target.value)}
                className="border rounded p-1 w-full"
              >
                <option value="">-- Select --</option>
                {headers.map((h, i) => (
                  <option key={i} value={i}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Category column (optional):</label>
              <select
                value={mapping.category ?? ''}
                onChange={(e) => handleMappingChange('category', e.target.value)}
                className="border rounded p-1 w-full"
              >
                <option value="">-- None --</option>
                {headers.map((h, i) => (
                  <option key={i} value={i}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Preview (first 5 rows):</h4>
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-2 py-1 border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map((h, i) => (
                      <td key={i} className="px-2 py-1 border">{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Import {file?.name}
            </button>
            <button
              onClick={() => setShowMapping(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}