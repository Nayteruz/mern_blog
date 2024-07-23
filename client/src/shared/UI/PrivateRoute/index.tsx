import useStore from "@/app/store/store.zustand";
import { ROUTES } from "@/shared/const/routes";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useStore();
  return currentUser ? <Outlet /> : <Navigate to={ROUTES.SIGN_IN} />;
};

export default PrivateRoute;
