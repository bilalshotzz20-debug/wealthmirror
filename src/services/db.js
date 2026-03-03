// src/services/db.js
import { openDB } from 'idb';

const DB_NAME = 'wealthmirror';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
        store.createIndex('date', 'date');
        store.createIndex('category', 'category');
        store.createIndex('type', 'type');
      }
    },
  });
}

export async function addTransaction(transaction) {
  const db = await initDB();
  return db.add('transactions', transaction);
}

export async function getAllTransactionsSorted() {
  const db = await initDB();
  const all = await db.getAll('transactions');
  return all.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function updateTransaction(transaction) {
  const db = await initDB();
  return db.put('transactions', transaction);
}

export async function deleteTransaction(id) {
  const db = await initDB();
  return db.delete('transactions', id);
}

export async function getTransaction(id) {
  const db = await initDB();
  return db.get('transactions', id);
}