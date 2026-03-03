// src/App.jsx
import { useState } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { CsvUploader } from './components/CsvUploader'; // new import

function App() {
  const { transactions, loading, error, add, update, remove } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showCsv, setShowCsv] = useState(false);

  const handleAdd = async (transaction) => {
    await add(transaction);
    setEditingTransaction(null);
  };

  const handleUpdate = async (transaction) => {
    await update(transaction);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await remove(id);
    }
  };

  const handleCancel = () => {
    setEditingTransaction(null);
  };

  const handleCsvImport = async (transactions) => {
    // Optional: add duplicate detection here (by comparing date+description+amount)
    for (const tx of transactions) {
      await add(tx);
    }
    setShowCsv(false);
  };

  if (loading) {
    return <div className="text-center p-8">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">WealthMirror</h1>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={() => setShowCsv(!showCsv)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {showCsv ? 'Hide CSV Import' : 'Import CSV'}
          </button>
        </div>

        {showCsv && (
          <CsvUploader onImport={handleCsvImport} />
        )}

        {!showCsv && (
          <TransactionForm
            transactionToEdit={editingTransaction}
            onSubmit={editingTransaction ? handleUpdate : handleAdd}
            onCancel={editingTransaction ? handleCancel : undefined}
          />
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet. Add one above or import CSV!</p>
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;