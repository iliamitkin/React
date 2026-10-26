// Простые unit-тесты для математических функций
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Тесты
describe('Math functions', () => {
  test('add function adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('multiply function multiplies two numbers', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 5)).toBe(0);
  });

  test('divide function divides two numbers', () => {
    expect(divide(6, 2)).toBe(3);
    expect(divide(10, 5)).toBe(2);
  });

  test('divide throws error when dividing by zero', () => {
    expect(() => divide(5, 0)).toThrow('Division by zero');
  });
});