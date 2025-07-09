import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import productReducer from "./slices/productslice";
import adminReducer from "./slices/adminslice";
import adminProductReducer from "./slices/adminproductSlice"; // ✅ Fixed naming consistency
import adminOrderReducer from "./slices/adminorderslice"; // ✅ Fixed naming consistency

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    products: productReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer, // ✅ Fixed case
    adminOrders: adminOrderReducer, // ✅ Fixed case
  },
});

export default store;
