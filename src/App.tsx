import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import Route from "./components/Route";
import MenuBar from "./components/MenuBar";
import PrivateRoute from "./components/Route/PrivateRoute";

import Dashboard from "./pages/Dashboard";
import Survey from "./pages/Survey";
import LoginPage from "./pages/LoginPage";

import "./App.scss";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log({ isAuthenticated });

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

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
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            onLoginSuccess={() => setIsAuthenticated(true)}
          >
            <Dashboard />
          </PrivateRoute>
        </Route>
        <Route path="/survey">
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            onLoginSuccess={() => setIsAuthenticated(true)}
          >
            <Survey />
          </PrivateRoute>
        </Route>
        <Route path="/login">
          <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
        </Route>
      </main>
    </section>
  );
}

export default App;
