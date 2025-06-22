import { describe, it, vi, expect } from "vitest";
import {
    formatField,
    getValidationError,
    getFormattedTime,
} from "./utils";

describe("formatField", () => {
    it("capitalizes and formats camelCase", () => {
        expect(formatField("firstName")).toBe("First Name");
        expect(formatField("re_password")).toBe("Re-enter Password");
    });
});

describe("getValidationError", () => {
    it("requires a value", () => {
        expect(getValidationError("email", "")).toBe("Email is required");
    });

    it("validates email format", () => {
        expect(getValidationError("email", "invalid")).toBe(
            "Enter a valid email address"
        );
    });

    it("validates phone number length", () => {
        expect(getValidationError("phone", "123")).toBe(
            "Phone number must be between 9 and 15 digits."
        );
    });

    it("validates password match", () => {
        expect(getValidationError("re_password", "pass123", "pass321")).toBe(
            "Passwords do not match."
        );
    });

    it("returns empty string for valid input", () => {
        expect(getValidationError("name", "John")).toBe("");
    });
});

describe("getFormattedTime", () => {
    const base = new Date("2025-06-11T12:00:00Z");

    it("returns 'Just now' if <1 minute ago", () => {
        // Freeze current time
        const now = new Date("2025-06-11T12:00:00Z");
        vi.useFakeTimers().setSystemTime(now);

        const lessthanAminute = new Date(now.getTime() - 30 * 1000); // 3 minutes ago

        expect(getFormattedTime(lessthanAminute)).toBe("Just now");

        // Restore real timers after the test
        vi.useRealTimers();
    });

    it("returns 'x minutes ago' if <= 5 minutes", () => {
        // Freeze current time
        const now = new Date("2025-06-11T12:00:00Z");
        vi.useFakeTimers().setSystemTime(now);

        const threeMinsAgo = new Date(now.getTime() - 3 * 60 * 1000); // 3 minutes ago

        expect(getFormattedTime(threeMinsAgo)).toMatch(/minutes ago/);

        // Restore real timers after the test
        vi.useRealTimers();
    });

    it("returns formatted time if today and more than 5 minutes ago", () => {
        // Freeze current time
        const now = new Date("2025-06-11T12:00:00Z");
        vi.useFakeTimers().setSystemTime(now);

        // 8 minutes ago (still today, not yesterday, not this week)
        const todayPast = new Date(now.getTime() - 8 * 60 * 1000);
        const formatted = getFormattedTime(todayPast);

        expect(formatted).toMatch(/\d{1,2}:\d{2}/); // e.g. 11:52 AM

        vi.useRealTimers();
    });

    it("returns formatted time for today", () => {
        const date = new Date(base.setHours(8, 0, 0));
        const formatted = getFormattedTime(date);
        expect(formatted).toMatch(/\d{1,2}:\d{2}/); // e.g. 8:00 AM
    });

    it("returns 'Yesterday at ...' if yesterday", () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(15, 0, 0);
        expect(getFormattedTime(date)).toMatch(/Yesterday at \d/);
    });

    it("returns weekday and time if date is earlier this week", () => {
        // Freeze time to a known Thursday
        const now = new Date("2025-06-19T12:00:00"); // Thursday
        vi.useFakeTimers().setSystemTime(now);

        const twoDaysAgo = new Date("2025-06-17T09:30:00"); // Tuesday this week
        const result = getFormattedTime(twoDaysAgo);

        expect(result).toMatch(/Tuesday at \d{1,2}:\d{2}/); // formatted like: Tuesday at 9:30 AM

        vi.useRealTimers();
    });

    it("returns full date if outside this week", () => {
        const date = new Date("2023-12-25T14:00:00Z");
        expect(getFormattedTime(date)).toMatch(/Dec 25, 2023 at/);
    });
});
