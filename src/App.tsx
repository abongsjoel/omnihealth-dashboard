import { Toaster } from "react-hot-toast";

import Dashboard from "./components/Dashboard";

import "./App.scss";

function App() {
  return (
    <>
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
      <Dashboard />
    </>
  );
}

export default App;
