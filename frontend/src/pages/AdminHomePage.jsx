import { Link } from "react-router-dom"; // ✅ Fixed import
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAdminProducts } from "../redux/slices/adminproductSlice";
import { fetchAllOrders } from "../redux/slices/adminorderslice"; // ✅ Fixed import

export default function AdminHomePage() {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalorders,
    totalsales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  const { user, authLoaded } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authLoaded && user?.role === "admin") {
      dispatch(fetchAdminProducts());
      dispatch(fetchAllOrders());
    }
  }, [authLoaded, user, dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {productsLoading || ordersLoading ? (
        <p>Loading data...</p>
      ) : productsError || ordersError ? (
        <p className="text-red-500">
          {productsError
            ? `Error loading products: ${productsError}`
            : `Error loading orders: ${ordersError}`}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-2xl">${(totalsales ?? 0).toFixed(2)}</p>
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-2xl">{totalorders}</p>
            <Link to="/admin/orders" className="text-blue-500 hover:underline">
              Manage Orders
            </Link>
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Products</h2>
            <p className="text-2xl">{products.length}</p>
            <Link
              to="/admin/products"
              className="text-blue-500 hover:underline"
            >
              {" "}
              {/* ✅ Fixed incorrect link */}
              Manage Products
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user?.name || "Guest User"}</td>
                    <td className="p-4">
                      ${(order.totalPrice ?? 0).toFixed(2)}
                    </td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
