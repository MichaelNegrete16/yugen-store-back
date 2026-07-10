export function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 6);
  return `YUGEN-${timestamp}-${random}`;
}
