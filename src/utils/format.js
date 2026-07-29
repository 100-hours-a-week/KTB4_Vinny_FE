export function formatCount(value) {
  const count = Number(value);

  if (count < 0) {
    return "0";
  }
  if (count < 1000) {
    return String(count);
  }

  const countInThousands = Math.floor(count / 100) / 10;
  return `${countInThousands.toFixed(1).replace(".0", "")}k`;
}
