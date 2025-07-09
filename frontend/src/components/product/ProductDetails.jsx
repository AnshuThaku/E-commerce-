import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productslice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handlequantityChange = (action) => {
    if (action == "plus") setSelectedQuantity((prev) => prev + 1);
    if (action == "minus") setSelectedQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 1500,
      });
      return;
    }

    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity: selectedQuantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to the cart successfully!", {
          duration: 1000,
        });
      })

      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail images */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct?.images?.length > 0 &&
                selectedProduct.images.map((image, index) => (
                  <img
                    onClick={() => setMainImage(image.url)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === image.url
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                  />
                ))}
            </div>

            {/* Main product details */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img
                  src={mainImage || "https://placehold.co/150x150"}
                  onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                  alt={selectedProduct?.images?.[0]?.altText || "Main product"}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="md:w-1/2 md:ml-10 flex flex-col items-start">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-lg text-gray-600 mb-1 line-through">
                {selectedProduct.originalPrice &&
                  `$${selectedProduct.originalPrice}`}
              </p>
              <p className="text-xl text-gray-500 mb-2">
                ${selectedProduct.price}
              </p>
              <p className="text-gray-600 mb-4 text-xl">
                {selectedProduct.description}
              </p>
              {/* Colors */}
              <div className="mb-4">
                <p className="text-xl font-bold">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct?.colors?.map((color) => (
                    <button
                      onClick={() => setSelectedColor(color)}
                      key={color}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color
                          ? "border-4 border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.8)",
                      }}
                      aria-label={`Select color ${color}`}
                    ></button>
                  ))}
                </div>
              </div>
              {/* Sizes */}
              <div className="mb-4">
                <p className="text-xl font-bold">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct?.sizes?.map((size) => (
                    <button
                      onClick={() => setSelectedSize(size)}
                      key={size}
                      className={`px-4 py-2 border rounded ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <p className="text-xl font-bold">Quantity:</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handlequantityChange("minus")}
                    className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                    disabled={selectedQuantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-lg">{selectedQuantity}</span>
                  <button
                    onClick={() => handlequantityChange("plus")}
                    className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-900"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "Add To Cart"}
              </button>
            </div>
          </div>

          {/* Similar Products Section */}
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
