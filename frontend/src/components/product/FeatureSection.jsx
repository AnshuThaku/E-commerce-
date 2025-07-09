import { HiArrowPathRoundedSquare, HiOutlineCreditCard } from "react-icons/hi2";
import { HiShoppingBag } from "react-icons/hi2";

export default function FeatureSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Feature 1 - Free Shipping */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiShoppingBag className="text-xl" aria-label="Shopping Bag Icon" />
          </div>
          <h4 className="tracking-tighter mb-2">Free International Shipping</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            On all orders over $100
          </p>
        </div>

        {/* Feature 2 - 45-Day Returns */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiArrowPathRoundedSquare
              className="text-xl"
              aria-label="Return Icon"
            />
          </div>
          <h4 className="tracking-tighter mb-2">45 DAYS RETURN</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            Money-back guarantee
          </p>
        </div>

        {/* Feature 3 - Secure Checkout */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiOutlineCreditCard
              className="text-xl"
              aria-label="Credit Card Icon"
            />
          </div>
          <h4 className="tracking-tighter mb-2">SECURE CHECKOUT</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            100% secure checkout process
          </p>
        </div>
      </div>
    </section>
  );
}
