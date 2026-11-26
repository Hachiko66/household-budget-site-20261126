// HomeLedger store — state, persistence and money maths.
// Everything lives in localStorage under one key, seeded from data.js on first run.

import { BUDGETS, CATEGORIES, MONTHS, SEED_BILLS, SEED_GOALS, SEED_TRANSACTIONS } from './data.js';

const STORAGE_KEY = 'homeledger-v1';

export function formatRupiah(amount) {
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

export function formatShort(amount) {
  if (amount >= 1000000) return 'Rp ' + (amount / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  if (amount >= 1000) return 'Rp ' + Math.round(amount / 1000) + ' rb';
  return formatRupiah(amount);
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#888' };
}

export function monthLabel(monthId) {
  const found = MONTHS.find((m) => m.id === monthId);
  return found ? found.label : monthId;
}

function freshState() {
  return {
    month: '2026-11',
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    budgets: { ...BUDGETS },
    goals: SEED_GOALS.map((g) => ({ ...g })),
    bills: SEED_BILLS.map((b) => ({ ...b, paidMonths: [...b.paidMonths] })),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export const state = loadState();

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  const fresh = freshState();
  state.month = fresh.month;
  state.transactions = fresh.transactions;
  state.budgets = fresh.budgets;
  state.goals = fresh.goals;
  state.bills = fresh.bills;
  saveState();
}

export function setMonth(monthId) {
  state.month = monthId;
  saveState();
}

export function transactionsFor(monthId) {
  return state.transactions.filter((t) => t.date.startsWith(monthId));
}

export function monthTotals(monthId) {
  const list = transactionsFor(monthId);
  let income = 0;
  let spending = 0;
  const byCategory = {};
  for (const t of list) {
    if (t.type === 'income') {
      income += t.amount;
    } else {
      spending += t.amount;
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }
  }
  const savings = income - spending;
  const rate = income > 0 ? Math.max(0, Math.round((savings / income) * 100)) : 0;
  return { income, spending, savings, rate, byCategory, count: list.length };
}

export function addTransaction(fields) {
  const tx = {
    id: 't-user-' + Date.now().toString(36),
    date: fields.date,
    description: fields.description.trim(),
    category: fields.category,
    type: fields.type,
    amount: Math.round(Math.abs(fields.amount)),
  };
  state.transactions.push(tx);
  saveState();
  return tx;
}

export function updateTransaction(id, fields) {
  const tx = state.transactions.find((t) => t.id === id);
  if (!tx) return null;
  tx.date = fields.date;
  tx.description = fields.description.trim();
  tx.category = fields.category;
  tx.type = fields.type;
  tx.amount = Math.round(Math.abs(fields.amount));
  saveState();
  return tx;
}

export function deleteTransaction(id) {
  const index = state.transactions.findIndex((t) => t.id === id);
  if (index === -1) return false;
  state.transactions.splice(index, 1);
  saveState();
  return true;
}

export function setBudget(categoryId, limit) {
  state.budgets[categoryId] = Math.max(0, Math.round(limit));
  saveState();
}

export function addToGoal(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return null;
  goal.saved = Math.min(goal.target, goal.saved + Math.round(Math.abs(amount)));
  saveState();
  return goal;
}

export function addGoal(name, target) {
  const goal = {
    id: 'g-user-' + Date.now().toString(36),
    name: name.trim(),
    note: 'Added by the family.',
    target: Math.round(Math.abs(target)),
    saved: 0,
  };
  state.goals.push(goal);
  saveState();
  return goal;
}

export function markBillPaid(billId, monthId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill || bill.paidMonths.includes(monthId)) return null;
  bill.paidMonths.push(monthId);
  const day = String(Math.min(bill.dueDay, 28)).padStart(2, '0');
  const tx = {
    id: 't-bill-' + billId + '-' + monthId,
    date: monthId + '-' + day,
    description: bill.name + ' — ' + monthLabel(monthId),
    category: bill.category,
    type: 'expense',
    amount: bill.amount,
  };
  state.transactions.push(tx);
  saveState();
  return { bill, tx };
}

export function upcomingBills(monthId) {
  return state.bills
    .filter((b) => !b.paidMonths.includes(monthId))
    .slice()
    .sort((a, b) => a.dueDay - b.dueDay);
}
