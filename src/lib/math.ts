
/**
 * Simple Linear Regression Implementation
 * y = mx + b
 */
export function linearRegression(data: { x: number; y: number }[]) {
  const n = data.length;
  if (n === 0) return { m: 0, b: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }

  const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  return { m, b };
}

export function predict(m: number, b: number, x: number) {
  return m * x + b;
}
