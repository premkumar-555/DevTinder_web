import { createSlice } from "@reduxjs/toolkit";

export const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    clearFeed: () => {
      return [];
    },
  },
});

// Action creators
export const { addFeed, clearFeed } = feedSlice.actions;

export default feedSlice.reducer;
