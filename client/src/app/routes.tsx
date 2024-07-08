import { ReactNode } from "react";
import { About, Dashboard, Home, Projects, SignIn, SignUp } from "@/pages";
import { ROUTES } from "@/shared/const/routes";

interface IRouteApp {
  path: string;
  element: ReactNode;
}

export const routesApp: IRouteApp[] = [
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.ABOUT,
    element: <About />,
  },
  {
    path: ROUTES.SIGN_IN,
    element: <SignIn />,
  },
  {
    path: ROUTES.SIGN_UP,
    element: <SignUp />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: ROUTES.PROJECTS,
    element: <Projects />,
  },
];
