// HomeLedger charts — hand-written SVG, no library.
// Every chart is built from plain numbers and returned as an SVG string.

function polar(cx, cy, radius, angleDeg) {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function arcPath(cx, cy, radius, startAngle, endAngle) {
  const [x1, y1] = polar(cx, cy, radius, startAngle);
  const [x2, y2] = polar(cx, cy, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

// Donut of spending by category. slices: [{label, value, color}].
export function donutChart(slices, size = 220) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 14;
  const thickness = 34;
  if (total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="No spending recorded"><circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#ece7d8" stroke-width="${thickness}"/><text x="${cx}" y="${cy}" text-anchor="middle" font-size="14" fill="#4c5a48">No spending</text></svg>`;
  }
  let angle = 0;
  const parts = slices.map((s) => {
    const sweep = (s.value / total) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    if (sweep >= 359.9) {
      return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${s.color}" stroke-width="${thickness}"/>`;
    }
    // Shrink each slice a touch so neighbours are separated.
    const gap = 1.2;
    return `<path d="${arcPath(cx, cy, radius, start + gap, end - gap)}" fill="none" stroke="${s.color}" stroke-width="${thickness}"/>`;
  });
  const inner = `<circle cx="${cx}" cy="${cy}" r="${radius - thickness / 2 - 6}" fill="#fffdf7"/>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category">${inner}${parts.join('')}</svg>`;
}

// Horizontal bars comparing income and spending per month. rows: [{label, income, spending}].
export function trendChart(rows, width = 640, height = 260) {
  const padLeft = 62;
  const padRight = 8;
  const padTop = 26;
  const padBottom = 26;
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spending)), 1);
  const groupWidth = (width - padLeft - padRight) / rows.length;
  const barWidth = Math.min(34, (groupWidth - 18) / 2);
  const plotHeight = height - padTop - padBottom;
  const y = (v) => padTop + plotHeight - (v / max) * plotHeight;
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Monthly income versus spending">`;
  // Gridlines at 0, 5 jt and 10 jt, labelled in the left margin clear of the bars.
  for (const v of [0, 5000000, 10000000]) {
    out += `<line x1="${padLeft}" y1="${y(v)}" x2="${width - padRight}" y2="${y(v)}" stroke="#e3ddcd" stroke-width="1"/><text x="${padLeft - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#4c5a48">Rp ${(v / 1000000).toLocaleString('id-ID')} jt</text>`;
  }
  rows.forEach((r, i) => {
    const cx = padLeft + groupWidth * i + groupWidth / 2;
    const incomeH = (r.income / max) * plotHeight;
    const spendH = (r.spending / max) * plotHeight;
    out += `<rect x="${(cx - barWidth - 3).toFixed(1)}" y="${y(r.income).toFixed(1)}" width="${barWidth}" height="${incomeH.toFixed(1)}" rx="3" fill="#2d6a4f"/>`;
    out += `<rect x="${(cx + 3).toFixed(1)}" y="${y(r.spending).toFixed(1)}" width="${barWidth}" height="${spendH.toFixed(1)}" rx="3" fill="#e4572e"/>`;
    out += `<text x="${cx.toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#22301f">${r.month}</text>`;
  });
  out += '</svg>';
  return out;
}

// A semicircular gauge for the savings rate (0–50% maps to 0–180 degrees).
export function savingsGauge(rate, size = 190) {
  const cx = size / 2;
  const cy = size / 2 + 6;
  const radius = size / 2 - 16;
  const clamped = Math.max(0, Math.min(50, rate));
  const endAngle = 180 - (clamped / 50) * 180;
  const [x, y] = polar(cx, cy, radius, endAngle);
  const track = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
  const value = clamped > 0
    ? `<path d="M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="#2d6a4f" stroke-width="16" stroke-linecap="round"/>`
    : '';
  return `<svg viewBox="0 0 ${size} ${size * 0.62}" width="${size}" height="${Math.round(size * 0.62)}" role="img" aria-label="Savings rate ${rate} percent"><path d="${track}" fill="none" stroke="#ece7d8" stroke-width="16" stroke-linecap="round"/>${value}<text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="30" font-weight="800" fill="#1d4a35">${rate}%</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11.5" fill="#4c5a48">saved of income</text></svg>`;
}

// Simple vertical bars for category totals. rows: [{label, value, color}].
export function categoryBars(rows, width = 640, height = 240) {
  const padTop = 8;
  const padBottom = 44;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const slot = width / rows.length;
  const barWidth = Math.min(46, slot * 0.6);
  const plotHeight = height - padTop - padBottom;
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Spending per category">`;
  rows.forEach((r, i) => {
    const h = Math.max(2, (r.value / max) * plotHeight);
    const x = slot * i + (slot - barWidth) / 2;
    const y = padTop + plotHeight - h;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth}" height="${h.toFixed(1)}" rx="4" fill="${r.color}"/>`;
    out += `<text x="${(x + barWidth / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="11" fill="#22301f">Rp ${(r.value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt</text>`;
    const label = r.label.length > 11 ? r.label.slice(0, 10) + '…' : r.label;
    out += `<text x="${(x + barWidth / 2).toFixed(1)}" y="${height - 26}" text-anchor="middle" font-size="11.5" fill="#4c5a48">${label}</text>`;
  });
  out += '</svg>';
  return out;
}
