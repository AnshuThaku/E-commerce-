import { useEffect, useState, useRef, useMemo } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/product/FilterSidebar";
import SortOptions from "../components/product/SortOptions";
import ProductGrid from "../components/product/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productslice";
import debounce from "lodash.debounce";

const Collection = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const queryParams = useMemo(() => {
    return Object.fromEntries([...searchParams]);
  }, [searchParams]);

  const sidebarRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchProductsDebounced = debounce(() => {
    dispatch(fetchProductByFilters({ collection, ...queryParams }));
  }, 300);

  useEffect(() => {
    if (collection) {
      fetchProductsDebounced();
    }
    return () => {
      fetchProductsDebounced.cancel();
    };
  }, [collection, queryParams]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Sorting logic here
  const sortBy = searchParams.get("sort") || "default";
  const sortedProducts = [...products];

  if (sortBy === "price-asc") {
    sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "price-desc") {
    sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === "popularity") {
    sortedProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
        aria-label="Toggle Filters"
      >
        <FaFilter className="mr-2" />
        Filters
      </button>

      <div
        ref={sidebarRef}
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:translate-x-0 lg:static`}
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        <SortOptions />
        <ProductGrid
          products={sortedProducts}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Collection;
