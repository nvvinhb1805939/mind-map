import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: null,
  current: null,
};

const editModeSlice = createSlice({
  name: 'editMode',
  initialState,
  reducers: {
    switchMode: (state, action) => {
      state.mode = action.payload.mode;
      state.current = action.payload.current;
    },
  },
});

export const { switchMode } = editModeSlice.actions;

export default editModeSlice.reducer;
