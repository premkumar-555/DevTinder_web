import { createSlice } from "@reduxjs/toolkit";

export const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    clearFeed: () => {
      return null;
    },
  },
});

// Action creators
export const { addFeed, clearFeed } = feedSlice.actions;

export default feedSlice.reducer;
