export function isOptionEnabled(val: unknown): boolean {
  return val === true || val === "true" || val === "";
}
