import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import MenuBar from "../MenuBar";
import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

// Mocks
const mockNavigate = vi.fn();

vi.mock("../../hooks/useNavigation", () => ({
  default: () => ({
    currentPath: "/",
    navigate: mockNavigate,
  }),
}));

vi.mock("../../common/Logo", () => () => <div data-testid="logo">Logo</div>);
vi.mock("../../common/Thumbnail", () => () => (
  <div data-testid="thumbnail">Thumbnail</div>
));

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

const renderWithStore = (store = createStore()) =>
  render(
    <Provider store={store}>
      <MenuBar />
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
    expect(screen.getByText("Dr. Test")).toBeInTheDocument();
    expect(screen.getByTestId("thumbnail")).toBeInTheDocument();
  });

  it("renders menu items and highlights current path", () => {
    renderWithStore();
    expect(screen.getByText("Dashboard")).toHaveClass("menu_item active");
    expect(screen.getByText("Survey")).toHaveClass("menu_item");
  });

  it("calls navigate when a top-level menu item is clicked", () => {
    renderWithStore();

    fireEvent.click(screen.getByTestId("menu_item_/survey"));

    expect(mockNavigate).toHaveBeenCalledWith("/survey");
  });
});
