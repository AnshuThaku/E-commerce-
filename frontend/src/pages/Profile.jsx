import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Myorder from "./Myorder";
import { logoutUser } from "../redux/slices/authSlice";
import { removeFromCart } from "../redux/slices/cartSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, authLoaded } = useSelector((state) => state.auth);

  // 🔒 Redirect to login if not authenticated
  useEffect(() => {
    if (authLoaded && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoaded, user, navigate]);

  // 🧹 Logout handler
  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(removeFromCart());
    navigate("/login", { replace: true });
  };

  // 🕐 Prevent UI from flashing before auth loads
  if (!authLoaded)
    return <div className="text-center py-10">Loading Profile...</div>;

  // 👻 Handle unexpected state
  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left: Profile Info */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6 bg-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{user.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Right: Orders */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <Myorder />
          </div>
        </div>
      </div>
    </div>
  );
}
