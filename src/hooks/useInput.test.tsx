import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInput } from "./useInput";

// Mock the utils module
vi.mock("../utils/utils", () => ({
  formatField: vi.fn((fieldName: string) => {
    // Simple implementation: capitalize first letter
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }),
}));

describe("useInput hook", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useInput("initial value"));

    expect(result.current.value).toBe("initial value");
    expect(result.current.error).toBeUndefined();
    expect(typeof result.current.handleChange).toBe("function");
    expect(typeof result.current.handleBlur).toBe("function");
  });

  it("initializes with empty string", () => {
    const { result } = renderHook(() => useInput(""));

    expect(result.current.value).toBe("");
    expect(result.current.error).toBeUndefined();
  });

  describe("handleChange", () => {
    it("updates value when input changes", () => {
      const { result } = renderHook(() => useInput(""));

      act(() => {
        result.current.handleChange({
          target: { name: "username", value: "john" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.value).toBe("john");
      expect(result.current.error).toBeUndefined();
    });

    it("sets error when value becomes empty and no previous error exists", () => {
      const { result } = renderHook(() => useInput("initial"));

      // First change to non-empty (no error)
      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "test@example.com" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBeUndefined();

      // Then change to empty (should set error)
      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.value).toBe("");
      expect(result.current.error).toBe("Email is required");
    });

    it("clears error when value changes to non-empty", () => {
      const { result } = renderHook(() => useInput(""));

      // First set an error by blurring on empty field
      act(() => {
        result.current.handleBlur({
          target: { name: "password", value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBe("Password is required");

      // Then change to non-empty value (should clear error)
      act(() => {
        result.current.handleChange({
          target: { name: "password", value: "secret123" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.value).toBe("secret123");
      expect(result.current.error).toBeUndefined();
    });

    it("does not set error when changing from empty to non-empty initially", () => {
      const { result } = renderHook(() => useInput(""));

      act(() => {
        result.current.handleChange({
          target: { name: "username", value: "john" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.value).toBe("john");
      expect(result.current.error).toBeUndefined();
    });
  });

  describe("handleBlur", () => {
    it("sets error when field is empty on blur", () => {
      const { result } = renderHook(() => useInput(""));

      act(() => {
        result.current.handleBlur({
          target: { name: "fullName", value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBe("FullName is required");
    });

    it("does not set error when field has value on blur", () => {
      const { result } = renderHook(() => useInput("john doe"));

      act(() => {
        result.current.handleBlur({
          target: { name: "fullName", value: "john doe" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBeUndefined();
    });

    it("overwrites existing error when blurring on empty field", () => {
      const { result } = renderHook(() => useInput(""));

      // Set initial error via change
      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "test" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBe("Email is required");

      // Blur on different field name
      act(() => {
        result.current.handleBlur({
          target: { name: "username", value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBe("Username is required");
    });
  });

  describe("formatField integration", () => {
    it("properly formats field names in error messages", () => {
      const { result } = renderHook(() => useInput(""));

      act(() => {
        result.current.handleBlur({
          target: { name: "firstName", value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBe("FirstName is required");
    });

    it("handles different field name formats", () => {
      const { result } = renderHook(() => useInput(""));

      // Test camelCase
      act(() => {
        result.current.handleBlur({
          target: { name: "phoneNumber", value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBe("PhoneNumber is required");
    });
  });

  describe("callback stability", () => {
    it("maintains stable callback references", () => {
      const { result, rerender } = renderHook(() => useInput(""));

      const initialHandleChange = result.current.handleChange;
      const initialHandleBlur = result.current.handleBlur;

      // Trigger a change to update internal state
      act(() => {
        result.current.handleChange({
          target: { name: "test", value: "new value" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      rerender();

      // Callbacks should remain the same reference
      expect(result.current.handleChange).toBe(initialHandleChange);
      expect(result.current.handleBlur).toBe(initialHandleBlur);
    });
  });
});
