import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

export default function OrderConfirmPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);
  const location = useLocation();
  const passedOrder = location.state?.order;

  // Fallback: use Redux checkout slice
  const order = passedOrder || checkout;

  useEffect(() => {
    if (order && order._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [order, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 7);
    return orderDate.toLocaleDateString();
  };

  const items = order?.orderItems || order?.checkoutItems || [];

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank you for your order!
      </h1>
      <div className="p-6 rounded-lg border">
        <div className="flex justify-between mb-20">
          <div>
            <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
            <p className="text-gray-500">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-emerald-700 text-sm">
              Estimated Delivery: {calculateEstimatedDelivery(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="mb-20">
          {items.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div>
                <h4 className="text-md font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  {item.color} | {item.size}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-md font-semibold">${item.price}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment</h4>
            <p className="text-gray-600">{order.paymentMethod}</p>
            <p className="text-gray-500 text-sm">
              Status: {order.paymentStatus}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
            <p className="text-gray-600">{order.shippingAddress.address}</p>
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
