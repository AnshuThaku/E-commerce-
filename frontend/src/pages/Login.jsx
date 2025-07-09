import { useEffect, useState } from "react";
import login from "../assets/login.webp";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import { mergeCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading, error, authLoaded } = useSelector(
    (state) => state.auth
  );
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (authLoaded && user) {
      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(redirect, { replace: true });
        });
      } else {
        navigate(redirect, { replace: true });
      }
    }
  }, [authLoaded, user, guestId, cart, redirect, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .catch(() => console.error("Login failed, please try again."));
  };

  if (!authLoaded) return null;

  return (
    <div className="flex">
      {/* Left side: Login form */}
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
            Enter your email and password to log in.
          </p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
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
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right side: Image */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
