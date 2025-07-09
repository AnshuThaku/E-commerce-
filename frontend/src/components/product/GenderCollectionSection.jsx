import mensCollection from "../../assets/mens-collection.jpeg";
import womensCollection from "../../assets/womens-collection.avif";
import { Link } from "react-router-dom";

export default function GenderCollectionSection() {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        <div className="relative flex-1">
          <img
            src={womensCollection}
            alt="Women's Collection"
            className="w-full h-[700px] object-cover"
          />

          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className=" text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>

        <div className="relative flex-1">
          <img
            src={mensCollection}
            alt="men's Collection"
            className="w-full h-[700px] object-cover"
          />

          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className=" text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
