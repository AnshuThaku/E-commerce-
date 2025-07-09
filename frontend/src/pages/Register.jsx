import { useState, useEffect } from "react";
import register from "../assets/register.webp";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "../redux/slices/authSlice"; // ✅ Fixed missing import
import { mergeCart } from "../redux/slices/cartSlice"; // ✅ Added missing import
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth); // ✅ Added error state
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/", { replace: true });
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/", { replace: true }); // ✅ Improved redirect handling
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
          <p className="text-center mb-6">
            Create an account by entering your details below.
          </p>
          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}{" "}
          {/* ✅ Display registration errors */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
              aria-label="Full name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
              aria-label="Email address"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
              aria-label="Password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white p-2 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
            disabled={loading} // ✅ Disable button when loading
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={register}
            alt="Create your account"
            className="h-[750px] w-full object-cover"
            loading="lazy" // ✅ Improved image loading performance
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
