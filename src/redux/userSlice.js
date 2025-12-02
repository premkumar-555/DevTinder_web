import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    clearUser: () => {
      return null;
    },
  },
});

// Action creators
export const { addUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
