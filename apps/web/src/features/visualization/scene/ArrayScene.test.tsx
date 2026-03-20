import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { demoVisualizationDefinitions } from "@node-canvas/visualization-contract";
import { LocaleProvider } from "../../i18n";
import { ArrayScene } from "./ArrayScene";

describe("ArrayScene", () => {
  it("renders values, pointer labels, and state markers", () => {
    const step = demoVisualizationDefinitions[0].visualization.steps[0];

    if (step.type !== "array") {
      throw new Error("Expected array step.");
    }

    render(
      <LocaleProvider>
        <ArrayScene step={step} slotCount={4} maxValue={7} />
      </LocaleProvider>,
    );

    expect(screen.getByText("7")).toBeTruthy();
    expect(screen.getByText("left")).toBeTruthy();
    expect(screen.getByTestId("array-bar-0").getAttribute("data-state")).toBe("compare");
    expect(screen.getByTestId("array-bar-1").getAttribute("data-state")).toBe("compare");
  });
});
