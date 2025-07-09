import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import Cart from "../layout/Cart";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.length > 0
      ? cart.products.reduce((total, product) => total + product.quantity, 0)
      : 0;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const toggleNavDrawer = () => {
    setNavDrawerOpen((prev) => !prev);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div>
          <Link to="/" className="text-2xl font-medium">
            Rabbit
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            MEN
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Topwear
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottomwear
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="hidden md:block bg-black px-2 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}

          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
            aria-label="Toggle Cart"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-[#ea2e0e] text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            onClick={toggleNavDrawer}
            className="md:hidden"
            aria-label="Toggle Navigation"
          >
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
          <Searchbar />
        </div>
      </nav>

      <Cart drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer} aria-label="Close Menu">
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Topwear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Bottomwear
            </Link>

            {/* 👉 Admin Link for Mobile */}
            {user?.role === "admin" && (
              <>
                <hr className="my-2" />
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Admin
                </p>
                <Link
                  to="/admin"
                  onClick={toggleNavDrawer}
                  className="block text-gray-700 font-medium hover:text-black"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/orders"
                  onClick={toggleNavDrawer}
                  className="block text-gray-700 font-medium hover:text-black"
                >
                  Manage Orders
                </Link>
                <Link
                  to="/admin/products"
                  onClick={toggleNavDrawer}
                  className="block text-gray-700 font-medium hover:text-black"
                >
                  Manage Products
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
