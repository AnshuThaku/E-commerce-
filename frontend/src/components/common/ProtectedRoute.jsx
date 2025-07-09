import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, authLoaded } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log("🛡 ProtectedRoute → authLoaded:", authLoaded);
  console.log("🛡 ProtectedRoute → user:", user);

  // Wait until Redux auth state is ready
  if (!authLoaded) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // If no user or role mismatch → redirect to login with return path
  if (!user || (role && user.role !== role)) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }

  // Authenticated and authorized → render children
  return children;
}
