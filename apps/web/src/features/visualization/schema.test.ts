import { describe, expect, it } from "vitest";
import {
  demoVisualizationDefinitions,
  parseVisualization,
} from "@node-canvas/visualization-contract";

describe("visualization schema", () => {
  it("accepts the bundled array visualization", () => {
    expect(
      parseVisualization(demoVisualizationDefinitions[0].visualization).id,
    ).toBe("bubble-sort");
  });

  it("accepts the bundled graph visualization", () => {
    expect(parseVisualization(demoVisualizationDefinitions[1].visualization).id).toBe(
      "dfs-traversal",
    );
  });

  it("rejects missing required fields", () => {
    expect(() =>
      parseVisualization({
        id: "missing-schema-version",
        title: "Broken payload",
        steps: [],
      }),
    ).toThrow(/Invalid visualization payload/);
  });

  it("rejects invalid enum values", () => {
    expect(() =>
      parseVisualization({
        schemaVersion: 1,
        id: "bad-enum",
        title: "Bad enum",
        steps: [
          {
            stepId: "bad-1",
            type: "array",
            values: [1, 2],
            cellStates: [{ index: 0, state: "sparkle" }],
          },
        ],
      }),
    ).toThrow(/Invalid visualization payload/);
  });

  it("rejects bad edge references", () => {
    expect(() =>
      parseVisualization({
        schemaVersion: 1,
        id: "bad-edge",
        title: "Bad edge",
        steps: [
          {
            stepId: "graph-1",
            type: "graph",
            structure: "graph",
            nodes: [{ id: "A", label: "A" }],
            edges: [{ source: "A", target: "B" }],
          },
        ],
      }),
    ).toThrow(/does not exist/);
  });

  it("rejects bad cell indices", () => {
    expect(() =>
      parseVisualization({
        schemaVersion: 1,
        id: "bad-index",
        title: "Bad index",
        steps: [
          {
            stepId: "array-1",
            type: "array",
            values: [4, 2],
            pointerLabels: [{ index: 4, label: "j" }],
          },
        ],
      }),
    ).toThrow(/out of bounds/);
  });
});
