// src/hooks/useTransactions.js
import { useState, useEffect } from 'react';
import { getAllTransactionsSorted, addTransaction, updateTransaction, deleteTransaction } from '../services/db';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactionsSorted();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const add = async (transaction) => {
    try {
      await addTransaction(transaction);
      await loadTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const update = async (transaction) => {
    try {
      await updateTransaction(transaction);
      await loadTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await deleteTransaction(id);
      await loadTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  return { transactions, loading, error, add, update, remove };
}