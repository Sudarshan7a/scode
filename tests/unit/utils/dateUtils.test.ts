import { describe, expect, it } from "vitest";
import { formatDate, formatDateShort, formatTime } from "@/lib/dateUtils";

describe("dateUtils", () => {
  const iso = "2025-10-04T15:30:00.000Z";

  it("returns 'TBD' when input is null", () => {
    expect(formatDate(null)).toBe("TBD");
    expect(formatDateShort(null)).toBe("TBD");
    expect(formatTime(null)).toBe("TBD");
  });

  it("formats long date", () => {
    expect(formatDate(iso)).toMatch(/Saturday/);
  });

  it("formats short date", () => {
    expect(formatDateShort(iso)).toBe("10/04/2025");
  });

  it("formats time", () => {
    const expected = new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    expect(formatTime(iso)).toBe(expected);
  });
});
