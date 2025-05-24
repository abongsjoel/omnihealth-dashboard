import { Toaster } from "react-hot-toast";

import Route from "./components/Route";
import MenuBar from "./components/MenuBar";
import Dashboard from "./pages/Dashboard";
import Survey from "./pages/Survey";

import "./App.scss";
import LoginPage from "./pages/LoginPage";

function App() {
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

      <MenuBar />

      <main className="app_main">
        <Route path="/">
          <Dashboard />
        </Route>
        <Route path="/survey">
          <Survey />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </main>
    </section>
  );
}

export default App;
