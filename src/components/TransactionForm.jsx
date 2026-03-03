// src/components/TransactionForm.jsx
import { useState } from 'react';

export function TransactionForm({ transactionToEdit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    date: transactionToEdit?.date || new Date().toISOString().split('T')[0],
    description: transactionToEdit?.description || '',
    amount: transactionToEdit?.amount || '',
    category: transactionToEdit?.category || '',
    type: transactionToEdit?.type || (transactionToEdit?.amount > 0 ? 'income' : 'expense'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return;
    const transaction = {
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      id: transactionToEdit?.id,
    };
    onSubmit(transaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {transactionToEdit ? 'Update' : 'Add'} Transaction
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}