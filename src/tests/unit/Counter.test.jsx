import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../../components/Counter';

// Unit тесты с JEST
describe('Counter component', () => {
  test('renders with initial value', () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByTestId('counter-title')).toHaveTextContent('Counter: 5');
  });

  test('increments count when increment button is clicked', () => {
    render(<Counter />);
    const incrementBtn = screen.getByTestId('increment-btn');

    fireEvent.click(incrementBtn);
    expect(screen.getByTestId('counter-title')).toHaveTextContent('Counter: 1');

    fireEvent.click(incrementBtn);
    expect(screen.getByTestId('counter-title')).toHaveTextContent('Counter: 2');
  });

  test('decrements count when decrement button is clicked', () => {
    render(<Counter initialValue={10} />);
    const decrementBtn = screen.getByTestId('decrement-btn');

    fireEvent.click(decrementBtn);
    expect(screen.getByTestId('counter-title')).toHaveTextContent('Counter: 9');
  });

  test('resets count when reset button is clicked', () => {
    render(<Counter initialValue={3} />);
    const incrementBtn = screen.getByTestId('increment-btn');
    const resetBtn = screen.getByTestId('reset-btn');

    // Увеличиваем счетчик
    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);
    expect(screen.getByTestId('counter-title')).toHaveTextContent('Counter: 5');

    // Сбрасываем
    fireEvent.click(resetBtn);
    expect(screen.getByTestId('counter-title')).toHaveTextContent('Counter: 3');
  });

  test('matches snapshot', () => {
    const { container } = render(<Counter initialValue={0} />);
    expect(container).toMatchSnapshot();
  });
});