import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import PaypalButton from "../cart/PaypalButton";
import { createCheckout } from "../../redux/slices/checkoutSlice";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutid, setCheckoutid] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    state: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const computedTotal = Array.isArray(cart?.products)
    ? cart.products.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
      )
    : 0;

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      createCheckout({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "Paypal",
        totalPrice: computedTotal,
      })
    );
    if (res.payload?._id) {
      setCheckoutid(res.payload._id);
    } else {
      console.error("Failed to create checkout.");
    }
  };

  const handlePaymentSuccess = async (details) => {
    if (!checkoutid) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutid}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (res.status === 200) {
        await handleFinalizeCheckout(checkoutid);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handleFinalizeCheckout = async (id) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${id}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if ([200, 201].includes(res.status)) {
        navigate("/order-confirmation", { state: { order: res.data } });
      }
    } catch (error) {
      console.error(
        "❌ Error finalizing checkout:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cart?.products?.length) return <p>No items in the cart</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* Checkout Form */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              className="w-full border rounded-lg p-2"
              disabled
              required
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              value={shippingAddress.firstname}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  firstname: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={shippingAddress.lastname}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  lastname: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Address"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                address: e.target.value,
              })
            }
            className="border p-2 rounded mb-4 w-full"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={shippingAddress.state}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, state: e.target.value })
            }
            className="border p-2 rounded mb-4 w-full"
            required
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  postalCode: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="mt-6">
            {!checkoutid ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay With Paypal</h3>
                <PaypalButton
                  amount={computedTotal}
                  onSuccess={handlePaymentSuccess}
                  onError={() => alert("Payment failed, try again")}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex justify-between items-start py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-gray-800 font-medium">{product.name}</h3>
                  <p className="text-gray-500 text-sm">Size: {product.size}</p>
                  <p className="text-gray-500 text-sm">
                    Color: {product.color}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">
                ${Number(product.price || 0).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>
            $
            {computedTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4 font-semibold">
          <p>Total</p>
          <p>
            $
            {computedTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
