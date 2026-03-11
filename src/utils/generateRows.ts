import type { Row } from "../types/row";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const departments = ["Engineering", "HR", "Sales", "Support", "Finance", "Ops"];

export function generateRows(count: number, year = 2026): Row[] {
  const rand = mulberry32(12345);

  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    const dept = departments[Math.floor(rand() * departments.length)];
    const revenue = Math.round(rand() * 20000);
    const cost = Math.round(rand() * 15000);

    rows.push({
      id: String(i + 1),
      employeeName: `Employee ${i + 1}`,
      department: dept,
      isActive: rand() > 0.08, // ~92% active
      revenue,
      cost,
      year,
    });
  }
  return rows;
}
