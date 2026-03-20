import { Suspense } from "react";
import { QueryClient } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { demoVisualizationDefinitions } from "@node-canvas/visualization-contract";
import { AppProviders } from "../providers/AppProviders";
import { appRoutes } from "./routes";
import {
  createStaticVisualizationRepository,
  type VisualizationRepository,
} from "../../features/visualization/repository";

const renderRoute = (
  initialEntries: string[],
  repository?: VisualizationRepository,
) => {
  const router = createMemoryRouter(appRoutes, { initialEntries });

  return render(
    <AppProviders
      repository={repository}
      queryClient={
        new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
            },
          },
        })
      }
    >
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>,
  );
};

describe("app routes", () => {
  it("opens the workbench directly on the home page", async () => {
    renderRoute(["/"]);

    expect(
      await screen.findByRole("heading", { name: "Bubble Sort", level: 1 }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "DFS Traversal" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Night" })).toBeTruthy();
  });

  it("loads a visualization by route param and updates copy when locale changes", async () => {
    renderRoute(["/play/bubble-sort"]);

    expect(
      await screen.findByRole("heading", { name: "Bubble Sort", level: 1 }),
    ).toBeTruthy();
    expect(await screen.findByText("Compare 7 and 3.")).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "中文" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "冒泡排序", level: 1 }),
      ).toBeTruthy();
    });

    expect(screen.getByText("比较 7 和 3。")).toBeTruthy();
  });

  it("shows an error state when the repository throws", async () => {
    const repository = createStaticVisualizationRepository({
      summaries: demoVisualizationDefinitions.map((definition) => definition.summary),
      visualizations: demoVisualizationDefinitions.map(
        (definition) => definition.visualization,
      ),
    });

    const brokenRepository = {
      listVisualizations: repository.listVisualizations,
      async getVisualization() {
        throw new Error("Invalid visualization payload: root");
      },
    };

    renderRoute(["/play/bubble-sort"], brokenRepository);

    expect(await screen.findByText("Something went wrong")).toBeTruthy();
    expect(await screen.findByText("Invalid visualization payload: root")).toBeTruthy();
  });
});
