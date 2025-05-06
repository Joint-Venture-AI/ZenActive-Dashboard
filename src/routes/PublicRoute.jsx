import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../redux/features/auth/authSlice";

export default function PublicRoute({ children }) {
  const user = useSelector(useCurrentUser);

  if (user && user?._id) {
    return <Navigate to={"/"} />;
  } else {
    return children;
  }
}
