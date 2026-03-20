import { describe, expect, it } from "vitest";
import { resolveLocalizedText } from "@node-canvas/visualization-contract";

describe("resolveLocalizedText", () => {
  it("returns raw strings unchanged", () => {
    expect(resolveLocalizedText("Bubble Sort", "zh")).toBe("Bubble Sort");
  });

  it("falls back to english when zh is missing", () => {
    expect(
      resolveLocalizedText(
        {
          en: "Depth First Search",
        },
        "zh",
      ),
    ).toBe("Depth First Search");
  });

  it("uses zh when available", () => {
    expect(
      resolveLocalizedText(
        {
          en: "Array Scene",
          zh: "数组场景",
        },
        "zh",
      ),
    ).toBe("数组场景");
  });
});
