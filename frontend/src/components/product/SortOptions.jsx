import { useSearchParams } from "react-router-dom";

export default function SortOptions() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (event) => {
    const sortBy = event.target.value;
    const newParams = new URLSearchParams(searchParams); // ✅ Create a new instance
    newParams.set("sort", sortBy);
    setSearchParams(newParams); // ✅ Avoid direct mutation
  };

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        className="border p-2 rounded-md focus:outline-none"
        id="sort"
        aria-label="Sort products"
        onChange={handleSortChange}
        value={searchParams.get("sort") || "default"} // ✅ Ensured fallback value
      >
        <option value="default">Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
}
