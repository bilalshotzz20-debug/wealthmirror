// src/components/TransactionList.jsx
import { motion, AnimatePresence } from 'framer-motion';

export function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <AnimatePresence>
            {transactions.length === 0 ? (
              <motion.tr
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                  No transactions yet. Add one above or import CSV.
                </td>
              </motion.tr>
            ) : (
              transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.category}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      onClick={() => onEdit(tx)}
                      className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      onClick={() => onDelete(tx.id)}
                      className="p-1 text-red-600 hover:text-red-900 rounded-full transition-colors"
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
