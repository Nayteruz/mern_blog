import { useAppSelector } from "@/app/store/hooks";
import { ROUTES } from "@/shared/const/routes";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to={ROUTES.SIGN_IN} />;
};

export default PrivateRoute;
