import { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

export default function NewArrivals() {
  const scrollRef = useRef(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error("❌ Error fetching new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const updateScrollButtons = () => {
      const container = scrollRef.current;
      if (container) {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons(); // Initial check
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtons);
      }
    };
  }, [newArrivals]);

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">🚀 New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Explore the freshest trends and latest releases, handpicked for you.
        </p>

        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${
              canScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400"
            }`}
            aria-label="Scroll left"
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border ${
              canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400"
            }`}
            aria-label="Scroll right"
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative`}
      >
        {newArrivals.length > 0 ? (
          newArrivals.map((product) => (
            <div
              key={product._id}
              className="min-w-[90%] sm:min-w-[50%] lg:min-w-[30%] relative"
            >
              <img
                src={product.images?.[0]?.url || "default-image.jpg"}
                alt={product.images?.[0]?.altText || "New Arrival Image"}
                className="w-full h-[500px] object-cover rounded-lg"
                draggable="false"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                <Link to={`products/${product._id}`} className="block">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="mt-1">${product.price.toFixed(2)}</p>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            ⏳ Loading new arrivals...
          </p>
        )}
      </div>
    </section>
  );
}
