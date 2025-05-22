import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { NavigationProvider } from "./context/Navigation.tsx";
import { store } from "./redux/store";
import App from "./App.tsx";

import "./reset.css";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NavigationProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NavigationProvider>
  </StrictMode>
);
