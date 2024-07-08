import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@components/Header";
import { routesApp } from "./app/routes";
import { Footer } from "./shared/UI/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {routesApp.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
