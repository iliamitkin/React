import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { mockHabitsApi } from '../api/mockHabitsApi';

export const loadHabits = createAsyncThunk('habits/load', () => mockHabitsApi.list());
export const createHabit = createAsyncThunk('habits/create', (title) => mockHabitsApi.create(title));
export const toggleHabitRemote = createAsyncThunk('habits/toggle', (id) => mockHabitsApi.toggle(id));

const habitsSlice = createSlice({
  name: 'habits', initialState: { items: [], status: 'idle', error: null, filter: 'Все' },
  reducers: {
    toggleHabit(state, action) { const habit = state.items.find((item) => item.id === action.payload); if (habit) habit.completed = !habit.completed; },
    addHabit: { reducer(state, action) { state.items.unshift(action.payload); }, prepare(title) { return { payload: { id: nanoid(), title, category: 'Моё', icon: '✦', color: 'mint', completed: false, streak: 0 } }; } },
    setFilter(state, action) { state.filter = action.payload; },
  },
  extraReducers(builder) {
    builder.addCase(loadHabits.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loadHabits.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(loadHabits.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      .addCase(createHabit.pending, (state) => { state.error = null; })
      .addCase(createHabit.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(createHabit.rejected, (state, action) => { state.error = action.error.message; })
      .addCase(toggleHabitRemote.pending, (state) => { state.error = null; })
      .addCase(toggleHabitRemote.fulfilled, (state, action) => { const index = state.items.findIndex((item) => item.id === action.payload.id); if (index !== -1) state.items[index] = action.payload; })
      .addCase(toggleHabitRemote.rejected, (state, action) => { state.error = action.error.message; });
  },
});
export const { toggleHabit, addHabit, setFilter } = habitsSlice.actions;
export default habitsSlice.reducer;
