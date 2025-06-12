import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import NavigationContext, { NavigationProvider } from "./Navigation";

function ConsumerComponent() {
  const { currentPath, navigate } = React.useContext(NavigationContext);

  return (
    <div>
      <div data-testid="current-path">{currentPath}</div>
      <button onClick={() => navigate("/about")}>Go to About</button>
    </div>
  );
}

describe("NavigationProvider", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/initial");
  });

  it("provides the initial currentPath from window.location.pathname", () => {
    render(
      <NavigationProvider>
        <ConsumerComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId("current-path").textContent).toBe("/initial");
  });

  it("updates currentPath when navigate is called", () => {
    render(
      <NavigationProvider>
        <ConsumerComponent />
      </NavigationProvider>
    );

    act(() => {
      screen.getByText("Go to About").click();
    });

    expect(screen.getByTestId("current-path").textContent).toBe("/about");
    expect(window.location.pathname).toBe("/about");
  });

  it("updates currentPath when popstate is triggered", () => {
    render(
      <NavigationProvider>
        <ConsumerComponent />
      </NavigationProvider>
    );

    act(() => {
      window.history.pushState({}, "", "/new-url");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.getByTestId("current-path").textContent).toBe("/new-url");
  });
});
