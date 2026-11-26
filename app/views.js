// HomeLedger views — one render function per hash route.
// Each returns an HTML string; app.js mounts it and wires the controls.

import { CATEGORIES, MONTHS, TREND } from './data.js';
import { categoryBars, donutChart, savingsGauge, trendChart } from './charts.js';
import {
  categoryById, formatRupiah, formatShort, monthLabel, monthTotals,
  state, transactionsFor, upcomingBills,
} from './store.js';

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function monthSelect(current) {
  const options = MONTHS.map((m) => `<option value="${m.id}"${m.id === current ? ' selected' : ''}>${m.label}</option>`).join('');
  return `<label>Month <select id="month-select" data-action="month">${options}</select></label>`;
}

function monthHead(title, intro) {
  return `<div class="page-head"><h1>${title}</h1><p>${intro}</p></div>
  <div class="month-row">${monthSelect(state.month)}</div>`;
}

function txRow(t) {
  const cat = categoryById(t.category);
  const amount = (t.type === 'income' ? '+' : '−') + ' ' + formatRupiah(t.amount);
  const cls = t.type === 'income' ? 'pos' : 'neg';
  return `<tr>
    <td>${t.date}</td>
    <td>${escapeHtml(t.description)}</td>
    <td><span class="cat-dot" style="background:${cat.color}"></span>${cat.label}</td>
    <td class="num ${cls}">${amount}</td>
  </tr>`;
}

function txTable(list) {
  if (list.length === 0) {
    return '<p class="muted">No transactions match this filter yet.</p>';
  }
  return `<div class="table-scroll"><table>
    <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th></tr></thead>
    <tbody>${list.map(txRow).join('')}</tbody>
  </table></div>`;
}

// ---------------- Overview ----------------

export function viewOverview() {
  const totals = monthTotals(state.month);
  const recent = transactionsFor(state.month).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const due = upcomingBills(state.month);
  const slices = CATEGORIES
    .map((c) => ({ label: c.label, value: totals.byCategory[c.id] || 0, color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const legend = slices.map((s) => `<span><span class="cat-dot" style="background:${s.color}"></span>${s.label} — ${formatShort(s.value)}</span>`).join('');
  const billsHtml = due.length === 0
    ? '<p class="muted">All bills for this month are paid. Nice work.</p>'
    : `<ul class="clean-list">${due.map((b) => `<li><span>${escapeHtml(b.name)} <span class="muted">· due ${b.dueDay} ${monthLabel(state.month)}</span></span><span class="num">${formatRupiah(b.amount)}</span></li>`).join('')}</ul>
      <p><a href="#/bills">See all bills →</a></p>`;
  return `
  <div class="page-head"><h1>${escapeHtml(monthLabel(state.month))} at a glance</h1>
  <p>Income, spending and savings for ${escapeHtml(monthLabel(state.month))} — Keluarga Mahendra, Jakarta.</p></div>
  <div class="month-row">${monthSelect(state.month)}</div>
  <div class="grid grid-3">
    <section class="card"><div class="stat-label">Income</div><div class="stat-value">${formatRupiah(totals.income)}</div><div class="stat-sub">Salaries + freelance, ${totals.count} transactions</div></section>
    <section class="card"><div class="stat-label">Spending</div><div class="stat-value">${formatRupiah(totals.spending)}</div><div class="stat-sub">Across ${Object.keys(totals.byCategory).length} categories</div></section>
    <section class="card"><div class="stat-label">Saved this month</div><div class="stat-value pos">${formatRupiah(totals.savings)}</div><div class="stat-sub">Savings rate ${totals.rate}% of income</div></section>
  </div>
  <div class="grid grid-2wide" style="margin-top:16px">
    <section class="card"><h2>Where the money went</h2>
      <div class="gauge-wrap">${donutChart(slices)}
      <div class="legend" style="flex:1;min-width:180px">${legend}</div></div>
      <p class="chart-note">Groceries are the biggest share, as usual — the family shops at Pasar Minggu every week.</p>
    </section>
    <section class="card"><h2>Savings rate</h2>
      <div class="gauge-wrap">${savingsGauge(totals.rate)}
      <p class="muted" style="flex:1;min-width:150px">The family aims to save at least 20% of income. ${totals.rate >= 20 ? 'This month clears the target — the surplus goes to the emergency fund.' : 'This month is below the 20% target — see Reports for what pushed spending up.'}</p></div>
    </section>
  </div>
  <div class="grid grid-2" style="margin-top:16px">
    <section class="card"><h2>Recent transactions</h2>${txTable(recent)}<p><a href="#/transactions">All transactions →</a></p></section>
    <section class="card"><h2>Upcoming bills</h2>${billsHtml}</section>
  </div>`;
}

// ---------------- Transactions ----------------

export function txForm(editing) {
  const catOptions = CATEGORIES.map((c) => `<option value="${c.id}"${editing && editing.category === c.id ? ' selected' : ''}>${c.label}</option>`).join('');
  const typeOptions = ['expense', 'income'].map((t) => `<option value="${t}"${editing && editing.type === t ? ' selected' : ''}>${t === 'expense' ? 'Expense' : 'Income'}</option>`).join('');
  return `<form id="tx-form" data-editing="${editing ? editing.id : ''}">
    <div class="form-grid">
      <label class="field"><span>Date</span><input type="date" name="date" required value="${editing ? editing.date : state.month + '-26'}"></label>
      <label class="field"><span>Amount (Rp)</span><input type="number" name="amount" min="1" step="1" required value="${editing ? editing.amount : ''}" placeholder="e.g. 125000"></label>
      <label class="field full"><span>Description</span><input type="text" name="description" required maxlength="80" value="${editing ? escapeHtml(editing.description) : ''}" placeholder="e.g. Belanja mingguan Pasar Minggu"></label>
      <label class="field"><span>Category</span><select name="category">${catOptions}</select></label>
      <label class="field"><span>Type</span><select name="type">${typeOptions}</select></label>
    </div>
    <div class="form-actions">
      <button type="submit">${editing ? 'Save changes' : 'Add transaction'}</button>
      ${editing ? '<button type="button" class="ghost" data-action="cancel-edit">Cancel</button>' : ''}
    </div>
  </form>`;
}

export function viewTransactions(filter) {
  const list = transactionsFor(state.month).slice().sort((a, b) => b.date.localeCompare(a.date) || a.description.localeCompare(b.description));
  const query = (filter.search || '').toLowerCase();
  const shown = list.filter((t) =>
    (filter.category === 'all' || t.category === filter.category) &&
    (query === '' || t.description.toLowerCase().includes(query)));
  const catOptions = ['<option value="all">All categories</option>'].concat(
    CATEGORIES.map((c) => `<option value="${c.id}"${filter.category === c.id ? ' selected' : ''}>${c.label}</option>`),
  ).join('');
  const rows = shown.map((t) => {
    const cat = categoryById(t.category);
    const amount = (t.type === 'income' ? '+' : '−') + ' ' + formatRupiah(t.amount);
    return `<tr>
      <td>${t.date}</td>
      <td>${escapeHtml(t.description)}</td>
      <td><span class="cat-dot" style="background:${cat.color}"></span>${cat.label}</td>
      <td class="num ${t.type === 'income' ? 'pos' : 'neg'}">${amount}</td>
      <td><button class="small ghost" data-action="edit-tx" data-id="${t.id}">Edit</button>
      <button class="small danger" data-action="delete-tx" data-id="${t.id}">Delete</button></td>
    </tr>`;
  }).join('');
  return `
  <div class="page-head"><h1>Transactions</h1>
  <p>Every rupiah in and out for ${escapeHtml(monthLabel(state.month))}. Add, edit or delete — changes are saved in this browser.</p></div>
  <div class="month-row">${monthSelect(state.month)}</div>
  <div class="card" style="margin-bottom:16px"><h2>${filter.editing ? 'Edit transaction' : 'Add a transaction'}</h2>${txForm(filter.editing)}</div>
  <div class="card">
    <div class="toolbar">
      <label class="field">Category <select id="filter-category" data-action="filter-category">${catOptions}</select></label>
      <label class="field">Search <input type="text" id="filter-search" data-action="filter-search" value="${escapeHtml(filter.search || '')}" placeholder="e.g. Pasar Minggu"></label>
      <span class="spacer"></span>
      <span class="muted">${shown.length} of ${list.length} shown</span>
    </div>
    ${shown.length === 0 ? '<p class="muted">No transactions match this filter yet.</p>' : `<div class="table-scroll"><table>
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table></div>`}
  </div>`;
}

// ---------------- Budgets ----------------

export function viewBudgets() {
  const totals = monthTotals(state.month);
  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const over = CATEGORIES.filter((c) => (totals.byCategory[c.id] || 0) > state.budgets[c.id]);
  const rows = CATEGORIES.map((c) => {
    const spent = totals.byCategory[c.id] || 0;
    const limit = state.budgets[c.id];
    const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const barClass = pct > 100 ? 'over' : pct >= 85 ? 'warn' : '';
    const remaining = limit - spent;
    return `<div class="budget-row">
      <div class="budget-top"><span><span class="cat-dot" style="background:${c.color}"></span>${c.label}</span>
      <span class="spent">${formatRupiah(spent)} <span class="muted">/ ${formatRupiah(limit)}</span></span></div>
      <div class="budget-meta"><span>${pct}% used ${pct > 100 ? '· <strong class="neg">over budget by ' + formatRupiah(-remaining) + '</strong>' : '· ' + formatRupiah(Math.max(0, remaining)) + ' left'}</span>
      <span><label class="hint">Monthly limit <input type="number" min="0" step="10000" value="${limit}" data-budget-input="${c.id}" style="width:130px;padding:4px 8px"> <button class="small" data-action="save-budget" data-id="${c.id}">Save</button></label></span></div>
      <div class="bar"><span class="${barClass}" style="width:${Math.min(100, pct)}%"></span></div>
    </div>`;
  }).join('');
  return `
  <div class="page-head"><h1>Budgets</h1>
  <p>Monthly limits per category for ${escapeHtml(monthLabel(state.month))}. The family sets limits together at the start of each month and reviews them every Sunday.</p></div>
  <div class="month-row">${monthSelect(state.month)}</div>
  ${over.length > 0 ? `<p class="insight warn"><strong>Over budget:</strong> ${over.map((c) => c.label + ' (' + Math.round(((totals.byCategory[c.id] || 0) / state.budgets[c.id]) * 100) + '%)').join(', ')}. Move money from a category with room left, or trim next week's spending.</p>` : '<p class="insight"><strong>On track:</strong> every category is within its limit this month.</p>'}
  <div class="card">
    <div class="budget-top" style="margin-bottom:6px"><span>Total budget</span><span>${formatRupiah(totals.spending)} spent of ${formatRupiah(totalBudget)}</span></div>
    <div class="bar" style="margin-bottom:8px"><span style="width:${Math.min(100, Math.round((totals.spending / totalBudget) * 100))}%"></span></div>
    ${rows}
  </div>`;
}

// ---------------- Goals ----------------

export function viewGoals() {
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  const cards = state.goals.map((g) => {
    const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
    return `<section class="card">
      <div class="goal-head"><strong>${escapeHtml(g.name)}</strong><span class="tag">${pct}%</span></div>
      <p class="goal-amounts">${formatRupiah(g.saved)} saved of ${formatRupiah(g.target)} · ${formatRupiah(g.target - g.saved)} to go</p>
      <div class="bar"><span style="width:${Math.min(100, pct)}%"></span></div>
      <p class="muted">${escapeHtml(g.note)}</p>
      <div class="goal-actions">
        <input type="number" min="1000" step="1000" placeholder="Amount (Rp)" data-goal-input="${g.id}" style="width:170px">
        <button class="small" data-action="add-goal-money" data-id="${g.id}">Add money</button>
      </div>
    </section>`;
  }).join('');
  return `
  <div class="page-head"><h1>Savings goals</h1>
  <p>${formatRupiah(totalSaved)} saved across ${state.goals.length} goals, of ${formatRupiah(totalTarget)} in total. Money moves here first on payday — before spending starts.</p></div>
  <div class="grid grid-2">${cards}</div>
  <div class="card" style="margin-top:16px"><h2>Start a new goal</h2>
    <form id="goal-form"><div class="form-grid">
      <label class="field"><span>Goal name</span><input type="text" name="name" required maxlength="60" placeholder="e.g. Biaya haji"></label>
      <label class="field"><span>Target amount (Rp)</span><input type="number" name="target" min="1000" step="1000" required placeholder="e.g. 5000000"></label>
    </div><div class="form-actions"><button type="submit">Create goal</button></div></form>
  </div>`;
}

// ---------------- Bills ----------------

export function viewBills() {
  const rows = state.bills.slice().sort((a, b) => a.dueDay - b.dueDay).map((b) => {
    const paid = b.paidMonths.includes(state.month);
    const status = paid
      ? '<span class="tag paid">Paid</span>'
      : '<span class="tag due">Due ' + b.dueDay + ' ' + monthLabel(state.month) + '</span>';
    return `<div class="bill-row">
      <div class="bill-info"><strong>${escapeHtml(b.name)}</strong><small>${escapeHtml(b.detail)} · due day ${b.dueDay} each month</small></div>
      ${status}
      <span class="bill-amount">${formatRupiah(b.amount)}</span>
      ${paid ? '' : `<button class="small" data-action="pay-bill" data-id="${b.id}">Mark paid</button>`}
    </div>`;
  }).join('');
  const dueTotal = state.bills.filter((b) => !b.paidMonths.includes(state.month)).reduce((a, b) => a + b.amount, 0);
  return `
  <div class="page-head"><h1>Bills</h1>
  <p>Recurring bills for ${escapeHtml(monthLabel(state.month))}. Marking a bill paid also records it as a transaction, so the books stay in balance.</p></div>
  <div class="month-row">${monthSelect(state.month)}</div>
  <div class="card">
    <p class="muted" style="margin-top:0"><strong>${formatRupiah(dueTotal)}</strong> still to pay this month · ${state.bills.length} recurring bills</p>
    ${rows}
  </div>
  <p class="hint" style="margin-top:12px">Tip: school fees (SPP) are paid by bank transfer on the 5th; PLN and PDAM are paid through the neighbourhood minimarket.</p>`;
}

// ---------------- Reports ----------------

export function viewReports() {
  const totals = monthTotals(state.month);
  const bars = CATEGORIES
    .map((c) => ({ label: c.label, value: totals.byCategory[c.id] || 0, color: c.color }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);
  const top = bars[0];
  const biggest = transactionsFor(state.month)
    .filter((t) => t.type === 'expense')
    .slice()
    .sort((a, b) => b.amount - a.amount)[0];
  const over = CATEGORIES.filter((c) => (totals.byCategory[c.id] || 0) > state.budgets[c.id]);
  const insights = [];
  if (top) insights.push(`<p class="insight"><strong>Biggest category: ${top.label}.</strong> ${formatRupiah(top.value)} in ${monthLabel(state.month)} — about ${Math.round((top.value / Math.max(1, totals.spending)) * 100)}% of all spending. Weekly market trips keep it lower than supermarket-only shopping.</p>`);
  if (biggest) insights.push(`<p class="insight"><strong>Biggest single expense: ${escapeHtml(biggest.description)}.</strong> ${formatRupiah(biggest.amount)} on ${biggest.date}. Single big items are usually school fees or a monthly bill, not impulse buys.</p>`);
  if (over.length > 0) {
    insights.push(`<p class="insight warn"><strong>Over budget:</strong> ${over.map((c) => c.label).join(', ')} went past its limit in ${monthLabel(state.month)}. The family covers the gap from categories with room left instead of touching savings.</p>`);
  } else {
    insights.push(`<p class="insight"><strong>All budgets held.</strong> No category went over its limit in ${monthLabel(state.month)}.</p>`);
  }
  insights.push(`<p class="insight"><strong>Savings rate ${totals.rate}%.</strong> ${totals.rate >= 20 ? 'Above the family’s 20% target — the surplus goes straight to the emergency fund.' : 'Below the family’s 20% target. October was stronger at 38% because school fees were lower that month.'}</p>`);
  return `
  <div class="page-head"><h1>Reports</h1>
  <p>Six months of income against spending, the breakdown for ${escapeHtml(monthLabel(state.month))}, and what it means in plain language.</p></div>
  <div class="month-row">${monthSelect(state.month)}</div>
  <section class="card" style="margin-bottom:16px"><h2>Income vs spending — Jun to Nov 2026</h2>
    ${trendChart(TREND)}
    <p class="chart-note"><span class="cat-dot" style="background:#2d6a4f"></span>Income &nbsp; <span class="cat-dot" style="background:#e4572e"></span>Spending &nbsp;·&nbsp; July spiked when the new school year started (uniforms, books, fees).</p>
  </section>
  <section class="card" style="margin-bottom:16px"><h2>Spending by category — ${escapeHtml(monthLabel(state.month))}</h2>
    ${bars.length > 0 ? categoryBars(bars) : '<p class="muted">No spending recorded this month.</p>'}
  </section>
  <section class="card"><h2>What this means</h2>${insights.join('')}</section>`;
}

// ---------------- About ----------------

export function viewAbout() {
  return `
  <div class="page-head"><h1>About HomeLedger</h1>
  <p>How Keluarga Mahendra keeps its budget — and how this site works.</p></div>
  <div class="grid grid-2">
    <section class="card"><h2>How the family budgets</h2>
      <p><strong>Pay the fixed things first.</strong> On payday, school fees (SPP), BPJS, internet and utilities are set aside before anything else is spent.</p>
      <p><strong>Shop weekly, cook mostly at home.</strong> Groceries come from Pasar Minggu every Sunday; eating out is capped at Rp 800.000 a month.</p>
      <p><strong>Save first, spend what is left.</strong> At least 20% of income moves to savings goals on payday — emergency fund first, then school fees and the new motorbike.</p>
      <p><strong>Review every Sunday.</strong> The family opens the Budgets page together and moves money between categories when one runs hot.</p>
    </section>
    <section class="card"><h2>About the data</h2>
      <p>Keluarga Mahendra is a fictional household: Budi (office staff), Sari (teacher), Raka (12) and Nia (8), living in Jakarta. Monthly income is Rp 12.500.000.</p>
      <p>Figures are realistic demo data for October–December 2026. Nothing here is a real person's spending.</p>
      <p>Everything you change — a new transaction, a budget limit, a paid bill, money added to a goal — is stored only in this browser (localStorage). No account, no server, no tracking.</p>
      <div class="form-actions"><button class="ghost" data-action="reset-data">Reset demo data</button></div>
    </section>
  </div>
  <div class="callout" style="margin-top:16px"><h2>A budget is a plan, not a punishment</h2>
  <p>The Mahendras do not track every rupiah to feel guilty about it. They track it so the money for school, the emergency fund and the odd family trip is there when it matters — and so the rest can be spent without worry.</p></div>`;
}
