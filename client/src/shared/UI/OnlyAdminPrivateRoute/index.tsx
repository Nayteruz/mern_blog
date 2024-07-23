import useStore from "@/app/store/store.zustand";
import { ROUTES } from "@/shared/const/routes";
import { Navigate, Outlet } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const { currentUser } = useStore();
  return currentUser && currentUser?.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.SIGN_IN} />
  );
};

export default OnlyAdminPrivateRoute;
