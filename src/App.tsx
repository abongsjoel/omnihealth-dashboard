import { Toaster } from "react-hot-toast";

import Route from "./components/Route";
import Dashboard from "./pages/Dashboard";

import "./App.scss";

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

      <main>
        <Route path="/">
          <Dashboard />
        </Route>
      </main>
    </section>
  );
}

export default App;
