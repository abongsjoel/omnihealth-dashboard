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

  describe("AuthHeader", () => {
    it("returns empty Bearer token when localStorage is null", async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { AuthHeader } = await import("./utils");

      expect(AuthHeader).toEqual({
        Authorization: "Bearer ",
      });
    });

    it("returns empty Bearer token when localStorage is empty string", async () => {
      mockLocalStorage.getItem.mockReturnValue("");

      const { AuthHeader } = await import("./utils");

      expect(AuthHeader).toEqual({
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

      const { AuthHeader } = await import("./utils");

      expect(AuthHeader).toEqual({
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

      const { AuthHeader } = await import("./utils");

      expect(AuthHeader).toEqual({
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

      const { AuthHeader } = await import("./utils");

      expect(AuthHeader).toEqual({
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

      const { AuthHeader } = await import("./utils");

      expect(AuthHeader).toEqual({
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

      const { AuthHeader } = await import("./utils");

      expect(AuthHeader).toEqual({
        Authorization: "Bearer ",
      });
    });

    it("throws error when localStorage contains invalid JSON", async () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json string");

      await expect(async () => {
        await import("./utils");
      }).rejects.toThrow();
    });

    it("throws error when localStorage contains malformed JSON", async () => {
      mockLocalStorage.getItem.mockReturnValue('{"name": "John",}'); // trailing comma

      await expect(async () => {
        await import("./utils");
      }).rejects.toThrow();
    });
  });
});
