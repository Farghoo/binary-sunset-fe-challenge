export function isE2EEnv(): boolean {
  // Vite replaces __E2E__ at build time
  if (typeof __E2E__ !== "undefined") return __E2E__;
  // fallback for non-vite environments
  return process.env.VITE_E2E === "true";
}
