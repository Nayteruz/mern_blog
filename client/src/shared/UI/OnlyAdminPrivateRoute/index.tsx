import { useAppSelector } from "@/app/store/hooks";
import { ROUTES } from "@/shared/const/routes";
import { Navigate, Outlet } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  return currentUser && currentUser?.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.SIGN_IN} />
  );
};

export default OnlyAdminPrivateRoute;
