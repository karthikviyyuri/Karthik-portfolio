export function formatMetric(value: number, suffix = ""): string {
  return `${Number.isInteger(value) ? value.toLocaleString("en-IN") : value.toString()}${suffix}`;
}

export function formatDateRange(value: string): string {
  return value;
}

