import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Always retrieve latest token at call time
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
    "Content-Type": "application/json",
  },
});

// Thunks

export const adminFetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/users`,
        getAuthHeaders()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/users`,
        userData,
        getAuthHeaders()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/users/${id}`,
        { name, email, role },
        getAuthHeaders()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`, getAuthHeaders());
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// Slice

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetAdminUsersState: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(adminFetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add user";
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.users.findIndex((u) => u._id === updated._id);
        if (index !== -1) {
          state.users[index] = updated;
        }
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const { resetAdminUsersState } = adminSlice.actions;
export default adminSlice.reducer;
