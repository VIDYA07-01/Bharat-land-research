import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    sidebarOpen: false,
    mobileMenuOpen: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setSidebarOpen: (state, { payload }) => { state.sidebarOpen = payload; },
    setMobileMenuOpen: (state, { payload }) => { state.mobileMenuOpen = payload; },
  },
});

export const { toggleDarkMode, setSidebarOpen, setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;
