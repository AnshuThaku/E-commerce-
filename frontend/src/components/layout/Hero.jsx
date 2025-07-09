import heroImg from "../../assets/rabbit-hero.webp"; // ✅ Used a more descriptive name for the image
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="Rabbit"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
        loading="lazy" // ✅ Improved image loading performance
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
        {" "}
        {/* ✅ Used Tailwind opacity */}
        <div className="text-center text-white p-6">
          <h2 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
            {" "}
            {/* ✅ Ensured heading hierarchy */}
            Vacation <br /> Ready
          </h2>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Explore our vacation-ready outfits with fast worldwide shipping.
          </p>
          <Link
            to="/collections/all"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg"
            aria-label="Shop Vacation Ready Outfits" // ✅ Added accessibility improvement
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
