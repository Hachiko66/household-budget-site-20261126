// HomeLedger seed data — Keluarga Mahendra, Jakarta.
// Two adults (Budi, office staff; Sari, teacher) and two children (Raka, 12; Nia, 8).
// Monthly income Rp 12.500.000. All figures are fictional demo data.

export const HOUSEHOLD = {
  name: 'Keluarga Mahendra',
  city: 'Jakarta',
  members: 'Budi & Sari, with Raka (12) and Nia (8)',
  monthlyIncome: 12500000,
};

export const MONTHS = [
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-11', label: 'November 2026' },
  { id: '2026-12', label: 'December 2026 (in progress)' },
];

export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', color: '#2d6a4f' },
  { id: 'transport', label: 'Transport', color: '#4a7fa5' },
  { id: 'school', label: 'School', color: '#7b5ea7' },
  { id: 'utilities', label: 'Utilities', color: '#c98a1b' },
  { id: 'internet', label: 'Internet & Phone', color: '#5b8c8a' },
  { id: 'dining', label: 'Dining Out', color: '#e4572e' },
  { id: 'health', label: 'Health', color: '#c96f9b' },
  { id: 'entertainment', label: 'Entertainment', color: '#8a6d3b' },
  { id: 'clothing', label: 'Clothing', color: '#9b7ede' },
  { id: 'household', label: 'Household', color: '#7a9e43' },
];

export const BUDGETS = {
  groceries: 3200000,
  transport: 1200000,
  school: 2000000,
  utilities: 900000,
  internet: 650000,
  dining: 800000,
  health: 500000,
  entertainment: 400000,
  clothing: 300000,
  household: 600000,
};

// type: 'income' | 'expense'. Amounts in rupiah.
export const SEED_TRANSACTIONS = [
  // ---- October 2026 ----
  { id: 't-oct-01', date: '2026-10-01', description: 'Gaji Budi — Oktober', category: 'income', type: 'income', amount: 8500000 },
  { id: 't-oct-02', date: '2026-10-01', description: 'Gaji Sari — Oktober', category: 'income', type: 'income', amount: 3200000 },
  { id: 't-oct-03', date: '2026-10-03', description: 'Belanja mingguan Pasar Minggu', category: 'groceries', type: 'expense', amount: 470000 },
  { id: 't-oct-04', date: '2026-10-05', description: 'SPP Raka (Okt)', category: 'school', type: 'expense', amount: 750000 },
  { id: 't-oct-05', date: '2026-10-05', description: 'SPP Nia (Okt)', category: 'school', type: 'expense', amount: 450000 },
  { id: 't-oct-06', date: '2026-10-06', description: 'Token listrik PLN', category: 'utilities', type: 'expense', amount: 300000 },
  { id: 't-oct-07', date: '2026-10-08', description: 'Belanja mingguan Super Indo', category: 'groceries', type: 'expense', amount: 640000 },
  { id: 't-oct-08', date: '2026-10-09', description: 'Servis motor di bengkel', category: 'transport', type: 'expense', amount: 420000 },
  { id: 't-oct-09', date: '2026-10-10', description: 'Bensin Pertamina', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't-oct-10', date: '2026-10-11', description: 'Baju & sepatu anak', category: 'clothing', type: 'expense', amount: 385000 },
  { id: 't-oct-11', date: '2026-10-12', description: 'Les matematika Raka', category: 'school', type: 'expense', amount: 300000 },
  { id: 't-oct-12', date: '2026-10-13', description: 'Belanja bulanan (Tokopedia)', category: 'household', type: 'expense', amount: 410000 },
  { id: 't-oct-13', date: '2026-10-14', description: 'Indihome', category: 'internet', type: 'expense', amount: 550000 },
  { id: 't-oct-14', date: '2026-10-15', description: 'Freelance desain — Sari', category: 'income', type: 'income', amount: 800000 },
  { id: 't-oct-15', date: '2026-10-15', description: 'Makan di luar — bakso keluarga', category: 'dining', type: 'expense', amount: 180000 },
  { id: 't-oct-16', date: '2026-10-17', description: 'Belanja mingguan Pasar Minggu', category: 'groceries', type: 'expense', amount: 505000 },
  { id: 't-oct-17', date: '2026-10-19', description: 'Paket data Telkomsel', category: 'internet', type: 'expense', amount: 120000 },
  { id: 't-oct-18', date: '2026-10-20', description: 'Tagihan air PDAM', category: 'utilities', type: 'expense', amount: 258000 },
  { id: 't-oct-19', date: '2026-10-21', description: 'Gojek & parkir', category: 'transport', type: 'expense', amount: 95000 },
  { id: 't-oct-20', date: '2026-10-22', description: 'Nonton bioskop keluarga', category: 'entertainment', type: 'expense', amount: 210000 },
  { id: 't-oct-21', date: '2026-10-24', description: 'Belanja mingguan Super Indo', category: 'groceries', type: 'expense', amount: 560000 },
  { id: 't-oct-22', date: '2026-10-25', description: 'Kondangan tetangga', category: 'entertainment', type: 'expense', amount: 200000 },
  { id: 't-oct-23', date: '2026-10-26', description: 'Bensin Pertamina', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't-oct-24', date: '2026-10-27', description: 'Makan keluarga — resto Padang', category: 'dining', type: 'expense', amount: 165000 },
  { id: 't-oct-25', date: '2026-10-28', description: 'Obat & vitamin apotek', category: 'health', type: 'expense', amount: 130000 },
  { id: 't-oct-26', date: '2026-10-29', description: 'Les bahasa Inggris Nia', category: 'school', type: 'expense', amount: 250000 },
  { id: 't-oct-27', date: '2026-10-30', description: 'Gas LPG 3 kg', category: 'household', type: 'expense', amount: 48000 },

  // ---- November 2026 ----
  { id: 't-nov-01', date: '2026-11-01', description: 'Belanja mingguan Pasar Minggu', category: 'groceries', type: 'expense', amount: 485000 },
  { id: 't-nov-02', date: '2026-11-02', description: 'Bensin Pertamina', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't-nov-03', date: '2026-11-02', description: 'Indomaret — susu & roti', category: 'groceries', type: 'expense', amount: 86500 },
  { id: 't-nov-04', date: '2026-11-03', description: 'Gojek ke kantor', category: 'transport', type: 'expense', amount: 42000 },
  { id: 't-nov-05', date: '2026-11-04', description: 'Makan siang keluarga di warteg', category: 'dining', type: 'expense', amount: 95000 },
  { id: 't-nov-06', date: '2026-11-05', description: 'SPP Raka (Nov)', category: 'school', type: 'expense', amount: 750000 },
  { id: 't-nov-07', date: '2026-11-05', description: 'SPP Nia (Nov)', category: 'school', type: 'expense', amount: 450000 },
  { id: 't-nov-08', date: '2026-11-06', description: 'Token listrik PLN', category: 'utilities', type: 'expense', amount: 300000 },
  { id: 't-nov-09', date: '2026-11-07', description: 'Belanja mingguan Super Indo', category: 'groceries', type: 'expense', amount: 612000 },
  { id: 't-nov-10', date: '2026-11-08', description: 'Langganan Netflix', category: 'entertainment', type: 'expense', amount: 186000 },
  { id: 't-nov-11', date: '2026-11-08', description: 'Nonton bioskop keluarga', category: 'entertainment', type: 'expense', amount: 240000 },
  { id: 't-nov-12', date: '2026-11-09', description: 'Paket data Telkomsel', category: 'internet', type: 'expense', amount: 120000 },
  { id: 't-nov-13', date: '2026-11-10', description: 'Tagihan air PDAM', category: 'utilities', type: 'expense', amount: 265000 },
  { id: 't-nov-14', date: '2026-11-11', description: 'Les matematika Raka', category: 'school', type: 'expense', amount: 300000 },
  { id: 't-nov-15', date: '2026-11-12', description: 'Belanja mingguan Pasar Minggu', category: 'groceries', type: 'expense', amount: 530000 },
  { id: 't-nov-16', date: '2026-11-13', description: 'GoFood makan malam', category: 'dining', type: 'expense', amount: 128000 },
  { id: 't-nov-17', date: '2026-11-14', description: 'Bensin Pertamina', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't-nov-18', date: '2026-11-15', description: 'Seragam sekolah Nia', category: 'clothing', type: 'expense', amount: 285000 },
  { id: 't-nov-19', date: '2026-11-16', description: 'Indihome', category: 'internet', type: 'expense', amount: 550000 },
  { id: 't-nov-20', date: '2026-11-17', description: 'Obat & vitamin apotek', category: 'health', type: 'expense', amount: 175000 },
  { id: 't-nov-21', date: '2026-11-18', description: 'Freelance desain — Sari', category: 'income', type: 'income', amount: 800000 },
  { id: 't-nov-22', date: '2026-11-18', description: 'Belanja mingguan Super Indo', category: 'groceries', type: 'expense', amount: 588000 },
  { id: 't-nov-23', date: '2026-11-19', description: 'Parkir & tol', category: 'transport', type: 'expense', amount: 96000 },
  { id: 't-nov-24', date: '2026-11-20', description: 'Makan di luar — ayam geprek', category: 'dining', type: 'expense', amount: 142000 },
  { id: 't-nov-25', date: '2026-11-21', description: 'Deterjen & sabun', category: 'household', type: 'expense', amount: 132000 },
  { id: 't-nov-26', date: '2026-11-22', description: 'Les bahasa Inggris Nia', category: 'school', type: 'expense', amount: 250000 },
  { id: 't-nov-27', date: '2026-11-23', description: 'Belanja mingguan Pasar Minggu', category: 'groceries', type: 'expense', amount: 495000 },
  { id: 't-nov-28', date: '2026-11-24', description: 'KRL & ojek online', category: 'transport', type: 'expense', amount: 88000 },
  { id: 't-nov-29', date: '2026-11-25', description: 'Gaji Budi — November', category: 'income', type: 'income', amount: 8500000 },
  { id: 't-nov-30', date: '2026-11-25', description: 'Gaji Sari — November', category: 'income', type: 'income', amount: 3200000 },
  { id: 't-nov-31', date: '2026-11-25', description: 'Buku & alat tulis Raka', category: 'school', type: 'expense', amount: 150000 },
  { id: 't-nov-32', date: '2026-11-25', description: 'Periksa gigi Nia', category: 'health', type: 'expense', amount: 250000 },
  { id: 't-nov-33', date: '2026-11-26', description: 'Gas LPG 3 kg', category: 'household', type: 'expense', amount: 48000 },

  // ---- December 2026 (first days) ----
  { id: 't-dec-01', date: '2026-12-01', description: 'Gaji Budi — Desember', category: 'income', type: 'income', amount: 8500000 },
  { id: 't-dec-02', date: '2026-12-01', description: 'Gaji Sari — Desember', category: 'income', type: 'income', amount: 3200000 },
  { id: 't-dec-03', date: '2026-12-01', description: 'Belanja mingguan Pasar Minggu', category: 'groceries', type: 'expense', amount: 520000 },
  { id: 't-dec-04', date: '2026-12-02', description: 'SPP Raka (Des)', category: 'school', type: 'expense', amount: 750000 },
  { id: 't-dec-05', date: '2026-12-02', description: 'SPP Nia (Des)', category: 'school', type: 'expense', amount: 450000 },
  { id: 't-dec-06', date: '2026-12-03', description: 'Token listrik PLN', category: 'utilities', type: 'expense', amount: 300000 },
  { id: 't-dec-07', date: '2026-12-03', description: 'Bensin Pertamina', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't-dec-08', date: '2026-12-04', description: 'Indomaret — susu & roti', category: 'groceries', type: 'expense', amount: 92000 },
  { id: 't-dec-09', date: '2026-12-05', description: 'GoFood makan malam', category: 'dining', type: 'expense', amount: 110000 },
];

export const SEED_GOALS = [
  { id: 'g-emergency', name: 'Dana darurat', note: 'Six months of essential spending, for job loss or a medical emergency.', target: 20000000, saved: 12400000 },
  { id: 'g-holiday', name: 'Liburan ke Bandung', note: 'A long weekend in Bandung with the kids — hotel, fuel and food.', target: 6000000, saved: 3750000 },
  { id: 'g-school', name: 'Biaya sekolah semester depan', note: 'Next semester fees, books and uniforms for Raka and Nia.', target: 8000000, saved: 5200000 },
  { id: 'g-motor', name: 'Motor baru', note: 'Replace the 2014 motorbike before it starts costing more in repairs.', target: 18000000, saved: 6800000 },
];

// Bills recur monthly. paidMonth holds the 'YYYY-MM' values already paid.
export const SEED_BILLS = [
  { id: 'b-spp-raka', name: 'SPP Raka', detail: 'School fee — Raka, grade 7', amount: 750000, dueDay: 5, category: 'school', paidMonths: ['2026-10', '2026-11', '2026-12'] },
  { id: 'b-spp-nia', name: 'SPP Nia', detail: 'School fee — Nia, grade 3', amount: 450000, dueDay: 5, category: 'school', paidMonths: ['2026-10', '2026-11', '2026-12'] },
  { id: 'b-pln', name: 'Listrik PLN', detail: 'Prepaid token, 900 VA', amount: 300000, dueDay: 6, category: 'utilities', paidMonths: ['2026-10', '2026-11', '2026-12'] },
  { id: 'b-pdam', name: 'Air PDAM', detail: 'Monthly water bill', amount: 265000, dueDay: 10, category: 'utilities', paidMonths: ['2026-10', '2026-11'] },
  { id: 'b-les', name: 'Les matematika Raka', detail: 'Private maths tutor, 4 sessions', amount: 300000, dueDay: 11, category: 'school', paidMonths: ['2026-10', '2026-11'] },
  { id: 'b-rt', name: 'Iuran RT & sampah', detail: 'Neighbourhood dues and waste collection', amount: 75000, dueDay: 15, category: 'household', paidMonths: ['2026-10'] },
  { id: 'b-indihome', name: 'Internet Indihome', detail: '100 Mbps + TV', amount: 550000, dueDay: 16, category: 'internet', paidMonths: ['2026-10', '2026-11'] },
  { id: 'b-bpjs', name: 'BPJS Kesehatan', detail: 'Health insurance, 4 family members', amount: 210000, dueDay: 20, category: 'health', paidMonths: ['2026-10'] },
];

// Six-month trend for the Reports page (income vs spending, Jun–Nov 2026).
export const TREND = [
  { month: 'Jun', income: 12500000, spending: 8400000 },
  { month: 'Jul', income: 12500000, spending: 9800000 },
  { month: 'Aug', income: 12500000, spending: 8900000 },
  { month: 'Sep', income: 12500000, spending: 9200000 },
  { month: 'Oct', income: 12500000, spending: 7696000 },
  { month: 'Nov', income: 12500000, spending: 8138500 },
];
