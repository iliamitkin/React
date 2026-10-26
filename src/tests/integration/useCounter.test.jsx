// Тестирование кастомных хуков
import { renderHook, act } from '@testing-library/react';
import {useState} from "react";

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return { count, increment, decrement };
}

test('custom hook works correctly', () => {
  const { result } = renderHook(() => useCounter(5));

  expect(result.current.count).toBe(5);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(6);

  act(() => {
    result.current.decrement();
  });

  expect(result.current.count).toBe(5);
});