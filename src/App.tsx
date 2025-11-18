import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { clearReturnTo, login, logout } from "./redux/slices/authSlice";
import { useAppDispatch } from "./redux/hooks";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Survey from "./pages/Survey";
import Auth from "./Auth";
import ErrorPage from "./pages/Error";

import "./App.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "survey",
        element: (
          <ProtectedRoute>
            <Survey />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <Auth /> },
      { path: "signup", element: <Auth /> },
    ],
  },
]);

function App() {
  const dispatch = useAppDispatch();

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
      <RouterProvider router={router} />;
    </section>
  );
}

export default App;
