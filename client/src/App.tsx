import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@components/Header";
import { Footer } from "./shared/UI/Footer";
import PrivateRoute from "./shared/UI/PrivateRoute";
import { About, Dashboard, Home, Projects, SignIn, SignUp } from "./pages";
import { ROUTES } from "./shared/const/routes";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className="flex-1 flex">
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          </Route>

          <Route path={ROUTES.PROJECTS} element={<Projects />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
