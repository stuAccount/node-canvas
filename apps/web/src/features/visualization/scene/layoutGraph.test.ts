import { describe, expect, it } from "vitest";
import type { Visualization } from "@node-canvas/visualization-contract";
import { buildGraphLayout } from "./layoutGraph";

describe("buildGraphLayout", () => {
  it("creates stable positions for graph nodes", () => {
    const visualization: Visualization = {
      schemaVersion: 1,
      id: "graph-layout",
      title: "Graph Layout",
      steps: [
        {
          stepId: "g-1",
          type: "graph",
          structure: "tree",
          nodes: [
            { id: "A", label: "A" },
            { id: "B", label: "B" },
            { id: "C", label: "C" },
          ],
          edges: [
            { source: "A", target: "B" },
            { source: "A", target: "C" },
          ],
        },
        {
          stepId: "g-2",
          type: "graph",
          structure: "tree",
          nodes: [
            { id: "A", label: "A" },
            { id: "B", label: "B", state: "active" },
            { id: "C", label: "C" },
          ],
          edges: [
            { source: "A", target: "B" },
            { source: "A", target: "C" },
          ],
          focusIds: ["B"],
        },
      ],
    };

    const first = buildGraphLayout(visualization);
    const second = buildGraphLayout(visualization);

    expect(first.positions.A).toEqual(second.positions.A);
    expect(first.positions.B).toEqual(second.positions.B);
  });

  it("respects explicit node positions", () => {
    const visualization: Visualization = {
      schemaVersion: 1,
      id: "graph-layout-manual",
      title: "Graph Layout Manual",
      steps: [
        {
          stepId: "g-1",
          type: "graph",
          structure: "graph",
          nodes: [
            {
              id: "A",
              label: "A",
              position: { x: 32, y: 48 },
            },
            { id: "B", label: "B" },
          ],
          edges: [{ source: "A", target: "B" }],
        },
      ],
    };

    const layout = buildGraphLayout(visualization);

    expect(layout.positions.A).toEqual({ x: 32, y: 48 });
  });
});
