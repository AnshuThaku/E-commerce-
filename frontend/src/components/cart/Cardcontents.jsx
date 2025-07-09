import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice"; // ✅ Fixed missing imports

export default function CardContents({ cart, userId, guestId }) {
  const dispatch = useDispatch();

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart?.products?.length > 0 ? (
        cart.products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-4 border-b"
          >
            <div className="flex items-start">
              <img
                src={product.image}
                alt={product.title}
                className="w-20 h-24 object-cover mr-4"
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-500">Size: {product.size}</p>
                <p className="text-sm text-gray-500">Color: {product.color}</p>
                <p className="text-sm text-gray-500">
                  Price: $
                  {!isNaN(product.price)
                    ? Number(product.price).toFixed(2)
                    : "N/A"}
                </p>

                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }
                    className="border rounded px-2 py-1 text-xl font-medium"
                  >
                    -
                  </button>
                  <span className="mx-4">{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-lg">
                $
                {!isNaN(product.price)
                  ? Number(product.price).toFixed(2)
                  : "N/A"}
              </p>
              <button
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.color
                  )
                }
                className="hover:text-red-700 transition"
              >
                <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">Your cart is empty</p>
      )}
    </div>
  );
}
