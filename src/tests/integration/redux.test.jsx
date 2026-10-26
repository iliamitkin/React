import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../store/userSlice';
import UserProfile from '../../components/UserProfile';

// Мок store для тестов
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
  });
};

describe('Redux Toolkit integration', () => {
  let store;

  beforeEach(() => {
    jest.useFakeTimers();
    store = createTestStore();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders initial state - no user', () => {
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );
    
    expect(screen.getByTestId('no-user-message')).toBeInTheDocument();
    expect(screen.getByTestId('load-btn')).toBeInTheDocument();
  });

  test('loads user successfully', async () => {
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );
    
    // Нажимаем кнопку загрузки
    fireEvent.click(screen.getByTestId('load-btn'));
    
    // Проверяем состояние загрузки
    expect(screen.getByTestId('user-loading')).toBeInTheDocument();
    
    // Пропускаем таймер
    jest.advanceTimersByTime(150);
    
    // Ждем завершения загрузки
    await waitFor(() => {
      expect(screen.getByTestId('user-profile-title')).toBeInTheDocument();
      expect(screen.getByTestId('user-name-display')).toHaveTextContent('Name: John Doe');
      expect(screen.getByTestId('user-email-display')).toHaveTextContent('Email: john@example.com');
      expect(screen.getByTestId('user-status-display')).toHaveTextContent('Status: active');
    });
    
    expect(screen.queryByTestId('user-loading')).not.toBeInTheDocument();
  });

  test('handles user not found error', async () => {
    // Мок fetchUser для возврата ошибки
    const { fetchUser } = require('../../store/userSlice');
    const originalFetchUser = fetchUser;
    
    // Переопределяем thunk для теста
    require('../../store/userSlice').fetchUser = jest.fn(() => ({
      type: 'user/fetchUser/rejected',
      payload: 'User not found',
    }));
    
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );
    
    fireEvent.click(screen.getByTestId('load-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user-error')).toHaveTextContent('Error: User not found');
      expect(screen.getByTestId('retry-btn')).toBeInTheDocument();
    });
    
    // Восстанавливаем оригинальный thunk
    require('../../store/userSlice').fetchUser = originalFetchUser;
  });

  test('updates user name using reducer', async () => {
    // Предзагружаем store с пользователем
    store = createTestStore({
      user: {
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          status: 'active',
        },
        loading: false,
        error: null,
      },
    });
    
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );
    
    // Проверяем начальное имя
    expect(screen.getByTestId('user-name-display')).toHaveTextContent('Name: John Doe');
    
    // Вводим новое имя и обновляем
    const nameInput = screen.getByTestId('name-input');
    const updateBtn = screen.getByTestId('update-name-btn');
    
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.click(updateBtn);
    
    // Проверяем обновленное имя
    expect(screen.getByTestId('user-name-display')).toHaveTextContent('Name: Jane Smith');
    expect(nameInput).toHaveValue('');
  });

  test('clears user data', async () => {
    // Предзагружаем store с пользователем
    store = createTestStore({
      user: {
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          status: 'active',
        },
        loading: false,
        error: null,
      },
    });
    
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );
    
    // Проверяем, что пользователь загружен
    expect(screen.getByTestId('user-profile-title')).toBeInTheDocument();
    
    // Нажимаем кнопку очистки
    fireEvent.click(screen.getByTestId('clear-btn'));
    
    // Проверяем, что пользователь очищен
    expect(screen.getByTestId('no-user-message')).toBeInTheDocument();
    expect(screen.getByTestId('load-btn')).toBeInTheDocument();
  });

  test('dispatches correct actions', () => {
    // Создаем мок store с spy на dispatch
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;
    
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );
    
    // Нажимаем кнопку загрузки
    fireEvent.click(screen.getByTestId('load-btn'));
    
    // Проверяем, что был вызван dispatch с правильным action
    expect(mockDispatch).toHaveBeenCalled();
    
    // Получаем переданный action
    const action = mockDispatch.mock.calls[0][0];
    
    // Проверяем, что это thunk функция
    expect(typeof action).toBe('function');
  });
});
