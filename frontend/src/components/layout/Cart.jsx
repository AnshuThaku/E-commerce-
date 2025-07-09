import { IoMdClose } from "react-icons/io";
import CardContents from "../cart/CardContents"; // ✅ Fixed import casing
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Cart({ drawerOpen, toggleCartDrawer }) {
  // ✅ Fixed variable name casing
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    navigate(user ? "/checkout" : "/login?redirect=/checkout");
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer} aria-label="Close Cart">
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {cart?.products?.length > 0 ? (
          <CardContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        )}
      </div>
      <div className="p-4 bg-white sticky bottom-0">
        {cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800" // ✅ Fixed typo
            >
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
