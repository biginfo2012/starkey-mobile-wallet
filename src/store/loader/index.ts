import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface LoaderState {
  isLoading: boolean;
}

const initialState: LoaderState = {
  isLoading: false,
};
const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    updateLoader: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      state.isLoading = action.payload.isLoading;
    },
  },
});
export const { updateLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
