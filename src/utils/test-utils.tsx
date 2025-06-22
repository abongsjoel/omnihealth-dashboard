import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";

// ✅ Wrap in combineReducers
const rootReducer = combineReducers({
  auth: authReducer,
});

export function renderWithProvider(
  ui: React.ReactElement,
  {
    preloadedState,
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
    ...renderOptions
  }: {
    preloadedState?: Record<string, unknown>;
    store?: ReturnType<typeof configureStore>;
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
