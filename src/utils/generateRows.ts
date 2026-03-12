import type { Row } from "../types/row";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const categories = [
  "SaaS",
  "Hardware",
  "Services",
  "Add-ons",
  "Marketplace",
  "Internal",
];

const productAdjectives = [
  "Nova",
  "Apex",
  "Pulse",
  "Nimbus",
  "Vertex",
  "Orbit",
  "Prism",
  "Forge",
];
const productNouns = [
  "Desk",
  "Sync",
  "Suite",
  "Flow",
  "IQ",
  "Hub",
  "Cloud",
  "Stack",
];

function productNameFor(i: number, rand: () => number) {
  const a = productAdjectives[Math.floor(rand() * productAdjectives.length)];
  const n = productNouns[Math.floor(rand() * productNouns.length)];
  return `${a} ${n} ${i + 1}`;
}

export function generateRows(count: number, year = 2026): Row[] {
  const rand = mulberry32(12345);

  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(rand() * categories.length)];
    const revenue = Math.round(rand() * 20000);
    const cost = Math.round(rand() * 15000);

    rows.push({
      id: String(i + 1),
      productName: productNameFor(i, rand),
      category,
      isActive: rand() > 0.08,
      revenue,
      cost,
      year,
    });
  }
  return rows;
}
