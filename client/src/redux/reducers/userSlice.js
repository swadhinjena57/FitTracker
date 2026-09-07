import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  authMessage: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.authMessage = action.payload.message || "Authentication successful.";
      localStorage.setItem("fittrack-app-token", action.payload.token);
    },
    restoreSession: (state, action) => {
      state.currentUser = action.payload;
    },
    updateUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearAuthMessage: (state) => {
      state.authMessage = "";
    },
    logout: (state) => {
      state.currentUser = null;
      state.authMessage = "";
      localStorage.removeItem("fittrack-app-token");
    },
  },
});

export const { loginSuccess, restoreSession, updateUser, clearAuthMessage, logout } = userSlice.actions;
export default userSlice.reducer;
