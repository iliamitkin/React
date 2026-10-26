import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import habitsReducer from '../store/habitsSlice';
import { mockHabitsApi } from '../api/mockHabitsApi';

function renderDashboard() {
  mockHabitsApi.reset();
  const store = configureStore({ reducer: { habits: habitsReducer } });
  render(<Provider store={store}><MemoryRouter><Dashboard/></MemoryRouter></Provider>);
  return store;
}

describe('Dashboard: пользовательские сценарии', () => {
  it('показывает состояние загрузки, а затем данные', async () => {
    renderDashboard();
    expect(screen.getByRole('status')).toHaveTextContent('Загружаем');
    expect(await screen.findByText('Выпить стакан воды')).toBeInTheDocument();
  });
  it('переключает выполнение привычки по клику', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const button = await screen.findByRole('button', { name: 'Отметить выполненной: Прогуляться на свежем воздухе' });
    await user.click(button);
    expect(await screen.findByRole('button', { name: 'Отметить невыполненной: Прогуляться на свежем воздухе' })).toHaveClass('checked');
  });
  it('добавляет привычку через ввод и отправку формы', async () => {
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByText('Выпить стакан воды');
    await user.type(screen.getByRole('textbox', { name: 'Новая привычка' }), 'Растяжка');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));
    expect(await screen.findByText('Растяжка')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Новая привычка' })).toHaveValue('');
  });
  it('фильтрует список и демонстрирует fireEvent для события click', async () => {
    const store = renderDashboard();
    await screen.findByText('Выпить стакан воды');
    fireEvent.click(screen.getByRole('button', { name: 'Выполнено' }));
    await waitFor(() => expect(store.getState().habits.filter).toBe('Выполнено'));
    expect(screen.queryByText('Прогуляться на свежем воздухе')).not.toBeInTheDocument();
  });
});
