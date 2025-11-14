import { useEffect } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import {
  clearReturnTo,
  login,
  logout,
  selectIsAuthenticated,
} from "./redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import Route from "./components/Route";
import MenuBar from "./components/MenuBar";
import PrivateRoute from "./components/Route/PrivateRoute";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Survey from "./pages/Survey";
import Auth from "./Auth";

import "./App.scss";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     errorElement: <ErrorPage />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { path: "products", element: <ProductsPage /> },
//       { path: "products/:productId", element: <ProductDetail /> },
//     ],
//   },
// ]);

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    const careteamMember = localStorage.getItem("careteamMember");

    if (careteamMember) {
      try {
        dispatch(login(JSON.parse(careteamMember)));
      } catch (err) {
        console.error("Invalid careteamMember in localStorage", err);
        dispatch(logout());
      }
    } else {
      dispatch(logout());
      dispatch(clearReturnTo());
    }
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
