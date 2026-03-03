// src/utils/csvMapper.js
// Given a sample row from CSV, we try to auto-detect columns
export function autoDetectMapping(headers) {
  const lowerHeaders = headers.map(h => h.toLowerCase());
  const mapping = {
    date: null,
    description: null,
    amount: null,
    category: null
  };

  // Simple keyword matching
  lowerHeaders.forEach((header, index) => {
    if (header.includes('date') || header.includes('datum')) mapping.date = index;
    else if (header.includes('description') || header.includes('desc') || header.includes('name') || header.includes('payee')) mapping.description = index;
    else if (header.includes('amount') || header.includes('ammount') || header.includes('sum') || header.includes('value')) mapping.amount = index;
    else if (header.includes('category') || header.includes('cat') || header.includes('type')) mapping.category = index;
  });

  return mapping;
}

// Convert a row using the mapping into our transaction format
export function mapRowToTransaction(row, mapping) {
  const transaction = {
    date: mapping.date !== null ? row[mapping.date] : new Date().toISOString().split('T')[0],
    description: mapping.description !== null ? row[mapping.description] : 'Unknown',
    amount: parseFloat(row[mapping.amount]) || 0,
    category: mapping.category !== null ? row[mapping.category] : 'Uncategorized',
  };
  // Ensure amount is a number and handle sign (expense vs income)
  if (isNaN(transaction.amount)) transaction.amount = 0;
  return transaction;
}