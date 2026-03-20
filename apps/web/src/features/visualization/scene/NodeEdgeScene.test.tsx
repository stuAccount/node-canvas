import { render, screen, waitFor } from "@testing-library/react";
import { Box } from "@mui/material";
import { describe, expect, it } from "vitest";
import type { Visualization } from "@node-canvas/visualization-contract";
import { LocaleProvider } from "../../i18n";
import { NodeEdgeScene, mapGraphStepToFlow } from "./NodeEdgeScene";
import { buildGraphLayout } from "./layoutGraph";

describe("NodeEdgeScene", () => {
  it("renders graph nodes and edge labels with state metadata", async () => {
    const visualization: Visualization = {
      schemaVersion: 1,
      id: "scene-graph",
      title: "Scene Graph",
      steps: [
        {
          stepId: "graph-1",
          type: "graph",
          structure: "graph",
          nodes: [
            { id: "A", label: "A", state: "active" },
            { id: "B", label: "B", state: "visited" },
          ],
          edges: [
            {
              id: "A-B",
              source: "A",
              target: "B",
              label: "edge",
              state: "visited",
            },
          ],
          focusIds: ["A"],
        },
      ],
    };

    const step = visualization.steps[0];

    if (step.type !== "graph") {
      throw new Error("Expected graph step.");
    }

    render(
      <LocaleProvider>
        <Box sx={{ width: 900, height: 520 }}>
          <NodeEdgeScene visualization={visualization} step={step} />
        </Box>
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("graph-node-A")).toBeTruthy();
    });

    expect(screen.getByTestId("graph-node-A").getAttribute("data-state")).toBe("active");

    const flowScene = mapGraphStepToFlow({
      step,
      layoutPositions: buildGraphLayout(visualization).positions,
      locale: "en",
    });

    expect(flowScene.edges[0]?.data?.state).toBe("visited");
  });
});
