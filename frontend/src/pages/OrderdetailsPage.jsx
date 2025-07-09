import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderdetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [id, dispatch]);

  if (loading) return <p className="p-6">Loading order details...</p>;
  if (error) return <p className="text-red-500 p-6">Error: {error}</p>;
  if (!orderDetails) return <p className="p-6">Order not found.</p>;

  const {
    _id,
    createdAt,
    shippingAddress,
    orderItems,
    totalPrice,
    isPaid,
    isDelivered,
    paymentMethod,
    shippingMethod,
  } = orderDetails;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

      <div className="p-4 sm:p-6 rounded-lg border">
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Order ID: #{_id}
            </h3>
            <p className="text-gray-600">
              {new Date(createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <span
              className={`${
                isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } px-3 py-1 rounded-full text-sm font-medium mb-2`}
            >
              {isPaid ? "Approved" : "Pending"}
            </span>

            <span
              className={`${
                isDelivered
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              } px-3 py-1 rounded-full text-sm font-medium mb-2`}
            >
              {isDelivered ? "Delivered" : "Pending"}
            </span>
          </div>
        </div>

        {/* Shipping info & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
            <p>Payment Method: {paymentMethod}</p>
            <p>Status: {isPaid ? "Paid" : "Unpaid"}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>

            <p>
              Address: {shippingAddress.city}, {shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold mb-4">Products</h4>
          <table className="min-w-full text-gray-600 mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Unit Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="py-2 px-4 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg mr-4"
                    />
                    <Link
                      to={`/products/${item.productId}`}
                      className="text-blue-500 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4">${item.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link to="/my-orders" className="text-blue-500 hover:underline">
          Back to my orders
        </Link>
      </div>
    </div>
  );
};

export default OrderdetailsPage;
