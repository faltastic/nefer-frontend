import { cn } from "../utils";

describe("cn utility", () => {
  test("merges class names", () => {
    expect(cn("px-2", "py-2")).toBe("px-2 py-2");
  });

  test("overrides conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  test("handles conditional classes", () => {
    expect(cn("px-2", true && "py-2", false && "hidden")).toBe("px-2 py-2");
  });

  test("handles undefined and null", () => {
    expect(cn("px-2", undefined, null)).toBe("px-2");
  });
});
