import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@components/Header";
import { Footer } from "./shared/UI/Footer";
import PrivateRoute from "./shared/UI/PrivateRoute";
import { About, Dashboard, Home, Projects, SignIn, SignUp } from "./pages";
import { ROUTES } from "./shared/const/routes";
import OnlyAdminPrivateRoute from "./shared/UI/OnlyAdminPrivateRoute";
import { CreatePost } from "./pages/CreatePost";
import { UpdatePost } from "./pages/UpdatePost";
import { Post } from "./pages/Post";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path={ROUTES.CREATE_POST} element={<CreatePost />} />
            <Route path={ROUTES.UPDATE_POST} element={<UpdatePost />} />
          </Route>
          <Route path={ROUTES.POST_SLUG} element={<Post />} />
          <Route path={ROUTES.PROJECTS} element={<Projects />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
