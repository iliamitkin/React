import React, {useState} from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from '../../components/UserForm';

//Тестирование React приложений с React Testing Library

describe('UserForm component', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  test('renders form with all fields', () => {
    render(<UserForm onSubmit={mockSubmit} />);

    expect(screen.getByTestId('user-form')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('age-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    render(<UserForm onSubmit={mockSubmit} />);
    const submitBtn = screen.getByTestId('submit-btn');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    render(<UserForm onSubmit={mockSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('name-input'), 'John Doe');
    await user.type(screen.getByTestId('email-input'), 'john@example.com');
    await user.type(screen.getByTestId('age-input'), '30');

    await user.click(screen.getByTestId('submit-btn'));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      age: '30',
    });
  });

  test('clears form after successful submission', async () => {
    render(<UserForm onSubmit={mockSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('name-input'), 'Jane Smith');
    await user.type(screen.getByTestId('email-input'), 'jane@example.com');

    await user.click(screen.getByTestId('submit-btn'));

    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('email-input')).toHaveValue('');
    // Пустое значение input[type=number] нормализуется jest-dom в null.
    expect(screen.getByTestId('age-input')).toHaveValue(null);
  });
});


// Тестирование событий (onClick, onChange, onInput)

describe('Form events testing', () => {
  test('onChange updates input values', async () => {
    render(<UserForm onSubmit={jest.fn()} />);
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');

    // Используем fireEvent для onChange
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('onInput event for real-time validation', () => {
    // Компонент с onInput
    function RealTimeInput() {
      const [value, setValue] = useState('');
      const [error, setError] = useState('');

      const handleInput = (e) => {
        const val = e.target.value;
        setValue(val);

        if (val.length < 3) {
          setError('Minimum 3 characters');
        } else {
          setError('');
        }
      };

      return (
        <div>
          <input
            data-testid="realtime-input"
            value={value}
            onInput={handleInput}
          />
          {error && <span data-testid="realtime-error">{error}</span>}
        </div>
      );
    }

    render(<RealTimeInput />);
    const input = screen.getByTestId('realtime-input');

    fireEvent.input(input, { target: { value: 'ab' } });
    expect(screen.getByTestId('realtime-error')).toHaveTextContent('Minimum 3 characters');

    fireEvent.input(input, { target: { value: 'abcd' } });
    expect(screen.queryByTestId('realtime-error')).not.toBeInTheDocument();
  });

  test('userEvent vs fireEvent comparison', async () => {
    render(<UserForm onSubmit={jest.fn()} />);
    const nameInput = screen.getByTestId('name-input');
    const user = userEvent.setup();

    // userEvent симулирует реальное поведение пользователя
    await user.type(nameInput, 'Alice');
    expect(nameInput).toHaveValue('Alice');

    // fireEvent напрямую вызывает событие
    fireEvent.change(nameInput, { target: { value: 'Bob' } });
    expect(nameInput).toHaveValue('Bob');
  });
});
