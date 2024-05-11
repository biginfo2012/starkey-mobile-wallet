import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'theme',
  initialState: { darkMode: null } as ThemeState,
  reducers: {
    changeTheme: (state, { payload: { darkMode } }: ThemePayload) => {
      if (typeof darkMode !== 'undefined') {
        state.darkMode = darkMode;
      }
    },
    setDefaultTheme: (state, { payload: { darkMode } }: ThemePayload) => {
      if (typeof darkMode !== 'undefined') {
        state.darkMode = darkMode;
      }
    },
  },
});

export const { changeTheme, setDefaultTheme } = slice.actions;

export default slice.reducer;

export type ThemeState = {
  darkMode: boolean | null;
};

type ThemePayload = {
  payload: Partial<ThemeState>;
};
