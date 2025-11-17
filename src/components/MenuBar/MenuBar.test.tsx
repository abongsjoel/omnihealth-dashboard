import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import MenuBar from "../MenuBar";
import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

// Define the MenuItem type
interface MenuItem {
  label: string;
  path: string;
}

// Mocks
const thumbnailSpy = vi.fn();

vi.mock("../common/Logo", () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

vi.mock("../common/Thumbnail", () => ({
  __esModule: true,
  default: (props: {
    name: string;
    onLogout: () => void;
    menuItems?: MenuItem[];
    currentPath?: string;
    onMenuClick?: (path: string) => void;
  }) => {
    thumbnailSpy(props);
    return (
      <div>
        <div data-testid="thumbnail-name">{props.name}</div>
        <button data-testid="logout-button" onClick={props.onLogout}>
          Logout
        </button>
      </div>
    );
  },
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
          fullName: "Dr. Test Fullname",
          displayName: "Dr. Test",
          speciality: "Optamologist",
          email: "test@example.com",
          phone: "237670000000",
          createdAt: "",
          updatedAt: "",
        },
      },
    },
  });

const renderWithStore = (store = createStore(), initialRoute = "/") =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <MenuBar />
      </MemoryRouter>
    </Provider>
  );

describe("MenuBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders logo, welcome message, and thumbnail", () => {
    renderWithStore();
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    // Use getByTestId to avoid multiple matches
    expect(screen.getByTestId("thumbnail-name")).toHaveTextContent("Dr. Test");
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
  });

  it("renders the current page label when path matches", () => {
    renderWithStore();
    expect(screen.getByTestId("current_page")).toHaveTextContent("Dashboard");
  });

  it("renders Survey label when on /survey route", () => {
    renderWithStore(createStore(), "/survey");
    expect(screen.getByTestId("current_page")).toHaveTextContent("Survey");
  });

  it("passes menuItems and currentPath to Thumbnail", () => {
    renderWithStore();

    expect(thumbnailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        menuItems: expect.arrayContaining([
          expect.objectContaining({ label: "Dashboard", path: "/" }),
          expect.objectContaining({ label: "Survey", path: "/survey" }),
        ]),
        currentPath: "/",
        name: "Dr. Test",
      })
    );
  });

  it("passes correct currentPath to Thumbnail when on /survey", () => {
    renderWithStore(createStore(), "/survey");

    expect(thumbnailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPath: "/survey",
      })
    );
  });

  it("dispatches logout when logout button is clicked", () => {
    const store = createStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");

    renderWithStore(store);

    fireEvent.click(screen.getByTestId("logout-button"));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "auth/logout",
    });
  });

  it("displays displayName over fullName when both exist", () => {
    renderWithStore();
    expect(screen.getByTestId("thumbnail-name")).toHaveTextContent("Dr. Test");
  });
});
