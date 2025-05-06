import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../redux/features/auth/authSlice";
import { useSelector } from "react-redux";

export default function PrivateProtectedRoute({ children }) {
  const isTokenAvailable = localStorage.getItem("token");

  const user = useSelector(useCurrentUser);

  if (isTokenAvailable && user?._id && user?.role === "ADMIN") {
    return children;
  } else {
    return <Navigate to={"/auth/sign-in"} />;
  }
}
