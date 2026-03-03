// src/components/TransactionList.jsx
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
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{tx.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">{tx.category}</td>
              <td className={`px-6 py-4 whitespace-nowrap ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${Math.abs(tx.amount).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                  onClick={() => onEdit(tx)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(tx.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
