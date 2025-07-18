import { Link } from "react-router-dom";

export default function ProductGrid({ products, loading, error }) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products?.length > 0 ? (
        products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="block"
          >
            <div className="bg-white p-4 rounded-lg">
              <div className="w-full h-96 mb-4">
                <img
                  src={
                    product.images?.[0]?.url ||
                    "https://via.placeholder.com/300"
                  }
                  alt={product.images?.[0]?.altText || "New Arrival Image"}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-sm mb-2">{product.name}</h3>
              <p className="text-gray-500 font-medium text-sm tracking-tighter">
                ${product.price}
              </p>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-gray-600 text-center">No products found.</p>
      )}
    </div>
  );
}
