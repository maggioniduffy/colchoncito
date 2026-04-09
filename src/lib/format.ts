export function formatARS(n: number, options?: { showSign?: boolean }): string {
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const formatted = formatter.format(Math.abs(n));
  if (n < 0) return `−${formatted}`;
  if (options?.showSign && n > 0) return `+${formatted}`;
  return formatted;
}

export function formatUSD(n: number, options?: { showSign?: boolean }): string {
  const abs = Math.abs(n);
  const hasDecimals = abs % 1 !== 0;
  const formatter = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
  const formatted = `USD ${formatter.format(abs)}`;
  if (n < 0) return `−${formatted}`;
  if (options?.showSign && n > 0) return `+${formatted}`;
  return formatted;
}

export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return `hace ${seconds} seg`;
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours}h`;
  return date.toLocaleDateString("es-AR");
}
