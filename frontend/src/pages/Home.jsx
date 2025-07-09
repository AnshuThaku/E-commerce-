import Hero from "../components/layout/Hero.jsx";
import GenderCollectionSection from "../components/product/GenderCollectionSection.jsx";
import NewArrivals from "../components/product/NewArrivals.jsx";
import ProductDetails from "../components/product/ProductDetails.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Featured from "../components/product/Featured.jsx";
import FeatureSection from "../components/product/FeatureSection.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProductByFilters } from "../redux/slices/productslice.js";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null); // ✅ Fixed naming consistency

  useEffect(() => {
    dispatch(
      fetchProductByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch best-selling product:", error); // ✅ Improved error messaging
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center text-gray-600">
          Fetching best-selling product...
        </p> // ✅ Improved loading state
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <Featured />
      <FeatureSection />
    </div>
  );
};

export default Home;
