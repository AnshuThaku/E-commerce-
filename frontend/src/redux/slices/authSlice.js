import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetAdminOrdersState } from "./adminorderslice";
import { resetAdminUsersState as resetUserManagementState } from "./adminSlice";
import { resetAdminProductState } from "./adminproductSlice";

// Generate Guest ID
const generateGuestId = () => `guest_${new Date().getTime()}`;
const initialGuestId = localStorage.getItem("guestId") || generateGuestId();
localStorage.setItem("guestId", initialGuestId);

// Initial State
const initialState = {
  user: null,
  guestId: initialGuestId,
  loading: false,
  error: null,
  authLoaded: false, // Start false until hydration
};

// 🔄 Action: Load user from localStorage
export const loadUserFromStorage = () => (dispatch) => {
  const storedUser = localStorage.getItem("userInfo");
  if (storedUser) {
    dispatch(setUser(JSON.parse(storedUser)));
  } else {
    dispatch(clearAuthState(initialGuestId));
  }
};

// 🔐 Thunk: User Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🆕 Thunk: User Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🚪 Thunk: Logout + Reset all slices
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("userToken");

  const newGuestId = generateGuestId();
  localStorage.setItem("guestId", newGuestId);

  dispatch(clearAuthState(newGuestId));
  dispatch(resetAdminProductState());
  dispatch(resetAdminOrdersState());
  dispatch(resetUserManagementState());
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.authLoaded = true;
      state.error = null;
    },
    clearAuthState: (state, action) => {
      state.user = null;
      state.authLoaded = true;
      state.guestId = action.payload;
    },
    generateNewGuestId: (state) => {
      state.guestId = generateGuestId();
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔐 Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authLoaded = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authLoaded = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.authLoaded = true;
      })

      // 🆕 Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authLoaded = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authLoaded = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.authLoaded = true;
      });
  },
});

export const { clearAuthState, generateNewGuestId, setUser } =
  authSlice.actions;
export default authSlice.reducer;
