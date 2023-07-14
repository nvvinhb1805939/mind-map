import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  openId: null,
};

const popperSlice = createSlice({
  name: 'popper',
  initialState,
  reducers: {
    updateOpenId: (state, action) => {
      state.openId = action.payload;
    },
  },
});

export const { updateOpenId } = popperSlice.actions;

export default popperSlice.reducer;
