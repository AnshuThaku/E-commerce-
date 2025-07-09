import React from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const AdminSidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/");
    if (onNavigate) onNavigate(); // Auto-close sidebar on logout (mobile)
  };

  const getLinkClass = ({ isActive }) =>
    `py-3 px-4 rounded flex items-center space-x-2 transition-colors duration-200 ${
      isActive
        ? "bg-gray-700 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium" onClick={onNavigate}>
          Rabbit
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/users"
          className={getLinkClass}
          onClick={onNavigate}
        >
          <FaUser />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `py-3 px-4 rounded flex items-center space-x-2 ${
              isActive
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
          onClick={onNavigate}
        >
          <FaBoxOpen /> <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={getLinkClass}
          onClick={onNavigate}
        >
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/" className={getLinkClass} onClick={onNavigate}>
          <FaStore />
          <span>Shop</span>
        </NavLink>
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
