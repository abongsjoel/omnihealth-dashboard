import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("utils.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getAuthHeader", () => {
    it("returns empty Bearer token when localStorage is null", async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { getAuthHeader } = await import("./utils");
      const result = getAuthHeader();

      expect(result).toEqual({
        Authorization: "Bearer ",
      });
    });

    it("returns empty Bearer token when localStorage is empty string", async () => {
      mockLocalStorage.getItem.mockReturnValue("");

      const { getAuthHeader } = await import("./utils");
      const result = getAuthHeader();

      expect(result).toEqual({
        Authorization: "Bearer ",
      });
    });

    it("returns correct Bearer token when valid team member exists", async () => {
      const mockTeamMember = {
        id: "123",
        fullName: "Dr. Jane Doe",
        token: "jwt-token-abc123",
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTeamMember));

      const { getAuthHeader } = await import("./utils");
      const result = getAuthHeader();

      expect(result).toEqual({
        Authorization: "Bearer jwt-token-abc123",
      });
    });

    it("returns empty Bearer token when team member has no token property", async () => {
      const mockTeamMemberNoToken = {
        id: "123",
        fullName: "Dr. Jane Doe",
        // no token property
      };

      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(mockTeamMemberNoToken)
      );

      const { getAuthHeader } = await import("./utils");
      const result = getAuthHeader();

      expect(result).toEqual({
        Authorization: "Bearer ",
      });
    });

    it("returns empty Bearer token when team member token is null", async () => {
      const mockTeamMember = {
        id: "123",
        fullName: "Dr. Jane Doe",
        token: null,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTeamMember));

      const { getAuthHeader } = await import("./utils");
      const result = getAuthHeader();

      expect(result).toEqual({
        Authorization: "Bearer ",
      });
    });

    it("returns empty Bearer token when team member token is undefined", async () => {
      const mockTeamMember = {
        id: "123",
        fullName: "Dr. Jane Doe",
        token: undefined,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTeamMember));

      const { getAuthHeader } = await import("./utils");
      const result = getAuthHeader();

      expect(result).toEqual({
        Authorization: "Bearer ",
      });
    });

    it("returns empty Bearer token when team member token is empty string", async () => {
      const mockTeamMember = {
        id: "123",
        fullName: "Dr. Jane Doe",
        token: "",
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTeamMember));

      const { getAuthHeader } = await import("./utils");
      const result = getAuthHeader();

      expect(result).toEqual({
        Authorization: "Bearer ",
      });
    });

    it("throws error when localStorage contains invalid JSON", async () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json string");

      const { getAuthHeader } = await import("./utils");

      expect(() => getAuthHeader()).toThrow();
    });

    it("throws error when localStorage contains malformed JSON", async () => {
      mockLocalStorage.getItem.mockReturnValue('{"name": "John",}'); // trailing comma

      const { getAuthHeader } = await import("./utils");

      expect(() => getAuthHeader()).toThrow();
    });

    it("can be called multiple times and returns fresh token from localStorage", async () => {
      const { getAuthHeader } = await import("./utils");

      // First call - no token
      mockLocalStorage.getItem.mockReturnValue(null);
      expect(getAuthHeader()).toEqual({
        Authorization: "Bearer ",
      });

      // Second call - with token
      const mockTeamMember = {
        id: "456",
        fullName: "Dr. John Smith",
        token: "new-jwt-token-xyz789",
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTeamMember));

      expect(getAuthHeader()).toEqual({
        Authorization: "Bearer new-jwt-token-xyz789",
      });

      // Verify localStorage.getItem was called each time
      expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(2);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("careteamMember");
    });

    it("handles whitespace token gracefully", async () => {
      const mockTeamMember = {
        id: "123",
        fullName: "Dr. Jane Doe",
        token: "   ",
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTeamMember));

      const { getAuthHeader } = await import("./utils");
      const result = getAuthHeader();

      expect(result).toEqual({
        Authorization: "Bearer    ",
      });
    });
  });
});
