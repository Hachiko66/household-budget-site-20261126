[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Hachiko66/household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Hachiko66/household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# HomeLedger — a household budget site

A working household budget for **Keluarga Mahendra**, a fictional family of four
in Jakarta (two adults, two children) living on Rp 12.500.000 a month. Every
page is real and every control works — nothing is a mock-up.

## What it does

- **Overview** — income vs spending vs savings for the month, a savings-rate
  gauge, a spending-by-category donut, recent transactions and upcoming bills.
- **Transactions** — the full ledger, filterable by category and month, with
  search; add, edit and delete transactions.
- **Budgets** — a monthly limit per category with progress bars, over-budget
  warnings and editable limits.
- **Goals** — savings goals (emergency fund, holiday, school fees, motorbike)
  with progress; add money or create a new goal.
- **Bills** — the recurring bills schedule with due dates; marking a bill paid
  records it as a transaction too.
- **Reports** — a six-month income-vs-spending chart, a category breakdown and
  plain-language insights about what the numbers mean.
- **About** — how the family budgets, and a note that the figures are demo data.

All data is stored in the browser (localStorage). There is no account, no
server and no network request: the site is plain static files under `app/`
with no build step.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

or serve `app/` with any static HTTP server and open `index.html`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
into the output directory and writes `dossier.json` with the vendored
`vendor/makefun-frontend.ts`.

## Layout

- `app/index.html` — page shell and navigation
- `app/styles.css` — the whole design system
- `app/data.js` — seed data (transactions, budgets, goals, bills, trend)
- `app/store.js` — state, localStorage persistence and money maths
- `app/charts.js` — hand-written SVG charts (donut, bars, gauge, trend)
- `app/views.js` — one render function per route
- `app/app.js` — hash router and control wiring
- `main.ts` — the hand-in program
- `screenshots/` — real renders of the site in a browser
