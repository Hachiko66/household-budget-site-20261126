// HomeLedger app — hash router, view mounting and control wiring.
// Views render HTML; this file owns navigation, filters and every form.

import {
  addGoal, addToGoal, addTransaction, deleteTransaction, markBillPaid,
  resetState, saveState, setBudget, setMonth, state, updateTransaction,
} from './store.js';
import {
  viewAbout, viewBills, viewBudgets, viewGoals, viewOverview, viewReports,
  viewTransactions,
} from './views.js';

const mount = document.getElementById('view');

// Filter state lives outside the store: it is a view concern, not saved data.
const txFilter = { category: 'all', search: '', editing: null };

const ROUTES = {
  overview: () => viewOverview(),
  transactions: () => viewTransactions(txFilter),
  budgets: () => viewBudgets(),
  goals: () => viewGoals(),
  bills: () => viewBills(),
  reports: () => viewReports(),
  about: () => viewAbout(),
};

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '').split('/')[0];
  return ROUTES[hash] ? hash : 'overview';
}

function render() {
  const route = currentRoute();
  mount.innerHTML = ROUTES[route]();
  document.querySelectorAll('.main-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  const search = document.getElementById('filter-search');
  if (search && txFilter.search) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  }
  window.scrollTo(0, 0);
}

function rerenderKeepScroll() {
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
}

// --- form helpers ---

function readTxForm(form) {
  const data = new FormData(form);
  return {
    date: String(data.get('date') || ''),
    description: String(data.get('description') || ''),
    category: String(data.get('category') || 'groceries'),
    type: String(data.get('type') || 'expense'),
    amount: Number(data.get('amount') || 0),
  };
}

// --- events (delegated on the mount point) ---

mount.addEventListener('change', (event) => {
  const el = event.target;
  const action = el.dataset.action;
  if (action === 'month') {
    setMonth(el.value);
    txFilter.editing = null;
    render();
  } else if (action === 'filter-category') {
    txFilter.category = el.value;
    render();
  }
});

mount.addEventListener('input', (event) => {
  const el = event.target;
  if (el.dataset.action === 'filter-search') {
    txFilter.search = el.value;
    // Re-render the table without moving focus away from the search box.
    const card = el.closest('.card');
    const fresh = viewTransactions(txFilter);
    const temp = document.createElement('div');
    temp.innerHTML = fresh;
    const newCard = temp.querySelector('.card:last-child');
    if (card && newCard) card.replaceWith(newCard);
    const search = document.getElementById('filter-search');
    if (search) {
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
    }
  }
});

mount.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.id === 'tx-form') {
    const fields = readTxForm(form);
    if (!fields.date || !fields.description || fields.amount <= 0) return;
    const editingId = form.dataset.editing;
    if (editingId) {
      updateTransaction(editingId, fields);
      txFilter.editing = null;
    } else {
      addTransaction(fields);
    }
    render();
  } else if (form.id === 'goal-form') {
    const data = new FormData(form);
    const name = String(data.get('name') || '');
    const target = Number(data.get('target') || 0);
    if (name.trim() && target > 0) {
      addGoal(name, target);
      render();
    }
  }
});

mount.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'edit-tx') {
    const tx = state.transactions.find((t) => t.id === id);
    if (tx) {
      txFilter.editing = tx;
      render();
      const form = document.getElementById('tx-form');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } else if (action === 'cancel-edit') {
    txFilter.editing = null;
    render();
  } else if (action === 'delete-tx') {
    const tx = state.transactions.find((t) => t.id === id);
    if (tx && window.confirm('Delete "' + tx.description + '" (' + tx.date + ')?')) {
      deleteTransaction(id);
      if (txFilter.editing && txFilter.editing.id === id) txFilter.editing = null;
      render();
    }
  } else if (action === 'save-budget') {
    const input = document.querySelector(`[data-budget-input="${id}"]`);
    if (input) {
      setBudget(id, Number(input.value || 0));
      rerenderKeepScroll();
    }
  } else if (action === 'add-goal-money') {
    const input = document.querySelector(`[data-goal-input="${id}"]`);
    const amount = input ? Number(input.value || 0) : 0;
    if (amount > 0) {
      addToGoal(id, amount);
      render();
    } else if (input) {
      input.focus();
    }
  } else if (action === 'pay-bill') {
    markBillPaid(id, state.month);
    render();
  } else if (action === 'reset-data') {
    if (window.confirm('Reset all demo data back to the original figures? Your changes will be lost.')) {
      resetState();
      txFilter.category = 'all';
      txFilter.search = '';
      txFilter.editing = null;
      render();
    }
  }
});

window.addEventListener('hashchange', render);

// Seed a clean state on very first load, then render the current route.
saveState();
render();
