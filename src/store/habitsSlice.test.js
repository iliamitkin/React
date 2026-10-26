import reducer, { addHabit, setFilter, toggleHabit, loadHabits } from './habitsSlice';
import { configureStore } from '@reduxjs/toolkit';

describe('habits reducer', () => {
  const sample = { id: 'a', title: 'Прогулка', completed: false, streak: 0 };
  it('переключает выполнение привычки', () => {
    const state = { items: [sample], status: 'succeeded', error: null, filter: 'Все' };
    expect(reducer(state, toggleHabit('a')).items[0].completed).toBe(true);
  });
  it('добавляет привычку и меняет фильтр', () => {
    const state = reducer(undefined, addHabit('Растяжка'));
    expect(state.items[0]).toMatchObject({ title: 'Растяжка', completed: false, category: 'Моё' });
    expect(reducer(state, setFilter('Выполнено')).filter).toBe('Выполнено');
  });
  it('обрабатывает асинхронную загрузку через pending и fulfilled', async () => {
    jest.useFakeTimers();
    const store = configureStore({ reducer: { habits: reducer } });
    const request = store.dispatch(loadHabits());
    expect(store.getState().habits.status).toBe('loading');
    jest.runAllTimers();
    await request;
    expect(store.getState().habits.status).toBe('succeeded');
    expect(store.getState().habits.items).toHaveLength(4);
    jest.useRealTimers();
  });
});
