// useInput.test.tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useInput } from "./useInput";

// Mock getValidationError
vi.mock("../../utils/utils", () => ({
  getValidationError: vi.fn((name, value) =>
    value === "" ? `${name} is required` : undefined
  ),
}));

describe("useInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with default value", () => {
    const { result } = renderHook(() => useInput("initial"));

    expect(result.current.value).toBe("initial");
    expect(result.current.error).toBeUndefined();
  });

  it("updates value on change", () => {
    const { result } = renderHook(() => useInput(""));

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe("test@example.com");
    expect(result.current.error).toBeUndefined(); // no error since no prior error
  });

  it("calls getValidationError and sets error on blur", () => {
    const { result } = renderHook(() => useInput(""));

    act(() => {
      result.current.handleBlur({
        target: { name: "email", value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.error).toBe("Email is required");
  });

  it("re-validates on change if error already exists", () => {
    const { result } = renderHook(() => useInput(""));

    // Simulate blur to trigger initial error
    act(() => {
      result.current.handleBlur({
        target: { name: "email", value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Re-trigger change (this should re-validate)
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.error).toBe("Email is required");
  });
});
