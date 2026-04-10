import { createSlice } from '@reduxjs/toolkit';

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', avatar: 'A' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', password: 'password123', avatar: 'B' },
];

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, error: null },
  reducers: {
    login(state, action) {
      const { email, password } = action.payload;
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        const { password: _, ...user } = found;
        state.user = user;
        state.isAuthenticated = true;
        state.error = null;
      } else {
        state.error = 'Invalid email or password';
      }
    },
    register(state, action) {
      const { name, email, password } = action.payload;
      const exists = users.find(u => u.email === email);
      if (exists) {
        state.error = 'Email already registered';
      } else {
        const newUser = { id: users.length + 1, name, email, password, avatar: name[0].toUpperCase() };
        users.push(newUser);
        const { password: _, ...user } = newUser;
        state.user = user;
        state.isAuthenticated = true;
        state.error = null;
      }
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { login, register, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
