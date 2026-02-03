import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { apiSlice } from "@/features/api/apiSlice";

import {
  AUTH_SESSION_TOKEN,
  AUTH_ROLE,
} from "../../../constants/tokenKey";

interface AuthState {
  isAuthenticated: boolean;
  role: "Admin" | "Customer" | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ token: string; role: "Admin" | "Customer" }>
    ) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;

      Cookies.remove(AUTH_SESSION_TOKEN);
      Cookies.remove(AUTH_ROLE);
    },
  },
  extraReducers: (builder) => {

    builder.addMatcher(
      apiSlice.endpoints.adminLogin.matchFulfilled,
      (state, action) => {
        console.log("Admin login fulfilled:", action);
        console.log("action.payload:", action.payload);
        const token = action.payload.data.token;

        state.isAuthenticated = true;
        state.role = "Admin";
        state.token = token;

        Cookies.set(AUTH_SESSION_TOKEN, token);
        Cookies.set(AUTH_ROLE, "Admin");
      }
    );


    builder.addMatcher(
      apiSlice.endpoints.userLogin.matchFulfilled,
      (state, action) => {
        console.log("User login fulfilled:", action);
        console.log("action.payload:", action.payload);
        const token = action.payload.data.token;

        state.isAuthenticated = true;
        state.role = "Customer";
        state.token = token;

        Cookies.set(AUTH_SESSION_TOKEN, token);
        Cookies.set(AUTH_ROLE, "Customer");
      }
    );
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
