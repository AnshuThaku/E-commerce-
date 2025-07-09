import AdminSidebar from "./AdminSidebar";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom"; // Fixed import

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 768
  );

  const toggleSidebar = () => setSidebarOpen((prev) => !prev); // Improved readability

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
        <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>

      {/* Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 z-10 md:hidden pointer-events-auto" // Fixed background class
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
      >
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
