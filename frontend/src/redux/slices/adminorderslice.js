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

export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/orders`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status, isDelivered }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        {
          status,
          isDelivered, // no assumptions, send it directly
        },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/orders/${id}`, getAuthHeaders());
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

// Slice

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetAdminOrdersState: (state) => {
      state.orders = [];
      state.totalOrders = 0;
      state.totalSales = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;

        const totalSales = action.payload.reduce((acc, order) => {
          return acc + (order.totalprice ?? 0);
        }, 0);
        state.totalSales = totalSales;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      });
  },
});

export const { resetAdminOrdersState } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
