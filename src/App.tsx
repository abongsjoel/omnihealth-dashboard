import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { login, selectIsAuthenticated } from "./redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import Route from "./components/Route";
import MenuBar from "./components/MenuBar";
import PrivateRoute from "./components/Route/PrivateRoute";

import Dashboard from "./pages/Dashboard";
import Survey from "./pages/Survey";
import Auth from "./Auth";

import "./App.scss";

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") dispatch(login());
  }, [dispatch]);

  return (
    <section className="app_container">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "0.75rem",
            borderRadius: "6px",
          },
        }}
      />

      {isAuthenticated && <MenuBar />}

      <main className={`app_main ${!isAuthenticated ? "full_screen" : ""}`}>
        <Route path="/">
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </PrivateRoute>
        </Route>
        <Route path="/survey">
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Survey />
          </PrivateRoute>
        </Route>
        <Route path="/login">
          <Auth />
        </Route>
        <Route path="/signup">
          <Auth />
        </Route>
      </main>
    </section>
  );
}

export default App;
