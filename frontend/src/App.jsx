import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import store from "./redux/store";
import { loadUserFromStorage } from "./redux/slices/authSlice";

// Layouts
import Userlayout from "./components/layout/Userlayout";
import AdminLayout from "./components/admin/AdminLayout";

// Common
import ProtectedRoute from "./components/common/ProtectedRoute";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Collection from "./pages/Collection";
import ProductDetails from "./components/product/ProductDetails";
import Checkout from "./components/cart/Checkout";
import OrderConfirmPage from "./pages/OrderConfirmPage";
import OrderdetailsPage from "./pages/OrderdetailsPage";
import Myorder from "./pages/Myorder";

// Admin Pages
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/admin/Usermanagement";
import ProductManagement from "./components/admin/ProductManagement";
import EditProductPage from "./components/admin/Editproductpage";
import OrderManagement from "./components/admin/OrderManagement";

// ⛑ AppRouter component separates routes and handles authLoaded block
const AppRoutes = () => {
  const { authLoaded } = useSelector((state) => state.auth);

  if (!authLoaded) {
    return <div className="text-center py-10">Loading app...</div>; // Or your custom loader
  }

  return (
    <Routes>
      <Route path="/" element={<Userlayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="collections/:collection" element={<Collection />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="order-confirmation" element={<OrderConfirmPage />} />
        <Route
          path="order-details/:id"
          element={
            <ProtectedRoute>
              <OrderdetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-orders"
          element={
            <ProtectedRoute>
              <Myorder />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHomePage />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
        <Route path="orders" element={<OrderManagement />} />
      </Route>
    </Routes>
  );
};

// 🌱 Root App component bootstraps user hydration
const RootApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
};

// 🧩 Wrap the RootApp with Redux + Router providers
const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <RootApp />
    </BrowserRouter>
  </Provider>
);

export default App;
