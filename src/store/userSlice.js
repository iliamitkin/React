import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронный thunk для загрузки пользователя
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 100));

      if (userId === 1) {
        return {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          status: 'active',
        };
      }
      throw new Error('User not found');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.data = null;
      state.error = null;
    },
    updateUserName: (state, action) => {
      if (state.data) {
        state.data.name = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser, updateUserName } = userSlice.actions;
export default userSlice.reducer;