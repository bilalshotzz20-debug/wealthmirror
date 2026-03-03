// src/App.jsx
import { useState } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { CsvUploader } from './components/CsvUploader'; // new import
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="container mx-auto p-4"
      >
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-3xl font-bold"
          >
            WealthMirror
          </motion.h1>
        </motion.header>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            <motion.button
              onClick={() => setShowCsv(!showCsv)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {showCsv ? 'Hide CSV Import' : 'Import CSV'}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {showCsv ? (
              <motion.div
                key="csv"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CsvUploader onImport={handleCsvImport} />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TransactionForm
                  transactionToEdit={editingTransaction}
                  onSubmit={editingTransaction ? handleUpdate : handleAdd}
                  onCancel={editingTransaction ? handleCancel : undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
      </motion.div>
    </AnimatePresence>
  );
}

export default App;