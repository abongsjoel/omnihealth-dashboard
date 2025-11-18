import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Layout from "../Layout";
import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

// Mock MenuBar component
vi.mock("../MenuBar", () => ({
  default: () => <div data-testid="menu-bar">MenuBar Component</div>,
}));

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [careTeamApi.reducerPath]: careTeamApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(careTeamApi.middleware),
    preloadedState: {
      auth: {
        isAuthenticated: true,
        returnTo: null,
        careteamMember: {
          _id: "123",
          fullName: "Dr. Test",
          displayName: "Dr. T",
          speciality: "Cardiologist",
          email: "test@example.com",
          phone: "237670000000",
          createdAt: "",
          updatedAt: "",
        },
      },
    },
  });

const renderWithRouter = (childRoute = "/") =>
  render(
    <Provider store={createStore()}>
      <MemoryRouter initialEntries={[childRoute]}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Dashboard Content</div>} />
            <Route path="survey" element={<div>Survey Content</div>} />
            <Route path="patients" element={<div>Patients Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe("Layout Component", () => {
  it("renders MenuBar component", () => {
    renderWithRouter();

    expect(screen.getByTestId("menu-bar")).toBeInTheDocument();
    expect(screen.getByText("MenuBar Component")).toBeInTheDocument();
  });

  it("renders main element", () => {
    const { container } = renderWithRouter();

    const mainElement = container.querySelector("main");
    expect(mainElement).toBeInTheDocument();
  });

  it("renders child route content via Outlet (dashboard)", () => {
    renderWithRouter("/");

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("renders child route content via Outlet (survey)", () => {
    renderWithRouter("/survey");

    expect(screen.getByText("Survey Content")).toBeInTheDocument();
  });

  it("renders child route content via Outlet (patients)", () => {
    renderWithRouter("/patients");

    expect(screen.getByText("Patients Content")).toBeInTheDocument();
  });

  it("renders both MenuBar and Outlet content together", () => {
    renderWithRouter("/");

    // MenuBar should be present
    expect(screen.getByTestId("menu-bar")).toBeInTheDocument();

    // Outlet content should be present
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("has correct structure with MenuBar before main", () => {
    const { container } = renderWithRouter();

    const menuBar = screen.getByTestId("menu-bar");
    const mainElement = container.querySelector("main");

    // Check that MenuBar comes before main in the DOM
    expect(menuBar.compareDocumentPosition(mainElement!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it("wraps outlet content in main element", () => {
    const { container } = renderWithRouter("/");

    const mainElement = container.querySelector("main");
    const outletContent = screen.getByText("Dashboard Content");

    // Check that outlet content is inside main
    expect(mainElement).toContainElement(outletContent);
  });

  it("renders different content for different routes", () => {
    // Test dashboard route
    const { unmount: unmountDashboard } = renderWithRouter("/");
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    expect(screen.queryByText("Survey Content")).not.toBeInTheDocument();
    unmountDashboard();

    // Test survey route
    const { unmount: unmountSurvey } = renderWithRouter("/survey");
    expect(screen.getByText("Survey Content")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
    unmountSurvey();

    // Test patients route
    renderWithRouter("/patients");
    expect(screen.getByText("Patients Content")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Survey Content")).not.toBeInTheDocument();
  });

  it("maintains MenuBar across route changes", () => {
    // Dashboard route
    const { unmount: unmountDashboard } = renderWithRouter("/");
    expect(screen.getByTestId("menu-bar")).toBeInTheDocument();
    unmountDashboard();

    // Survey route
    const { unmount: unmountSurvey } = renderWithRouter("/survey");
    expect(screen.getByTestId("menu-bar")).toBeInTheDocument();
    unmountSurvey();

    // Patients route
    renderWithRouter("/patients");
    expect(screen.getByTestId("menu-bar")).toBeInTheDocument();
  });
});
