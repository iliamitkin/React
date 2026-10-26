import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AsyncComponent from '../../components/AsyncComponent';

describe('AsyncComponent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shows loading state initially', () => {
    render(<AsyncComponent userId={1} />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('displays user data after loading', async () => {
    render(<AsyncComponent userId={1} />);

    // Пропускаем таймер загрузки
    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toBeInTheDocument();
      expect(screen.getByTestId('user-name')).toHaveTextContent('Name: John Doe');
      expect(screen.getByTestId('user-email')).toHaveTextContent('Email: john@example.com');
      expect(screen.getByTestId('user-role')).toHaveTextContent('Role: admin');
    });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  test('shows error for invalid user ID', async () => {
    render(<AsyncComponent userId={999} />);

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Error: User not found');
    });
  });

  test('shows "no user selected" when userId is null', () => {
    render(<AsyncComponent userId={null} />);
    expect(screen.getByTestId('no-user')).toBeInTheDocument();
  });

  test('refetches data when userId changes', async () => {
    const { rerender } = render(<AsyncComponent userId={1} />);

    jest.advanceTimersByTime(150);
    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Name: John Doe');
    });

    // Меняем userId
    rerender(<AsyncComponent userId={2} />);

    // Должен снова показать loading
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Name: Jane Smith');
    });
  });
});