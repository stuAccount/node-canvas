import {
  demoVisualizationDefinitions,
  parseVisualization,
  parseVisualizationSummaryList,
  type Visualization,
  type VisualizationSummary,
} from "@node-canvas/visualization-contract";
import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";

export type VisualizationRepository = {
  listVisualizations: () => Promise<VisualizationSummary[]>;
  getVisualization: (id: string) => Promise<Visualization>;
};

const VisualizationRepositoryContext = createContext<VisualizationRepository | null>(
  null,
);

export const VisualizationRepositoryProvider = ({
  repository,
  children,
}: PropsWithChildren<{
  repository: VisualizationRepository;
}>) => (
  <VisualizationRepositoryContext.Provider value={repository}>
    {children}
  </VisualizationRepositoryContext.Provider>
);

export const useVisualizationRepository = () => {
  const repository = useContext(VisualizationRepositoryContext);

  if (!repository) {
    throw new Error(
      "useVisualizationRepository must be used within VisualizationRepositoryProvider.",
    );
  }

  return repository;
};

export const createStaticVisualizationRepository = ({
  summaries,
  visualizations,
}: {
  summaries: VisualizationSummary[];
  visualizations: Visualization[];
}): VisualizationRepository => {
  const summaryList = parseVisualizationSummaryList(summaries);
  const visualizationMap = new Map(
    visualizations.map((visualization) => [
      visualization.id,
      parseVisualization(visualization),
    ]),
  );

  return {
    async listVisualizations() {
      return summaryList;
    },
    async getVisualization(id: string) {
      const visualization = visualizationMap.get(id);

      if (!visualization) {
        throw new Error("Visualization not found.");
      }

      return visualization;
    },
  };
};

const demoRepository = createStaticVisualizationRepository({
  summaries: demoVisualizationDefinitions.map((definition) => definition.summary),
  visualizations: demoVisualizationDefinitions.map(
    (definition) => definition.visualization,
  ),
});

export const createHttpVisualizationRepository = (
  baseUrl = "/api/visualizations",
): VisualizationRepository => ({
  async listVisualizations() {
    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch visualizations: ${response.status}`);
    }

    const payload = await response.json();
    return parseVisualizationSummaryList(payload);
  },
  async getVisualization(id: string) {
    const response = await fetch(`${baseUrl}/${id}`);

    if (response.status === 404) {
      throw new Error("Visualization not found.");
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch visualization: ${response.status}`);
    }

    const payload = await response.json();
    return parseVisualization(payload);
  },
});

export const createDefaultVisualizationRepository = (): VisualizationRepository => {
  if (import.meta.env.VITE_VISUALIZATION_SOURCE === "http") {
    return createHttpVisualizationRepository(
      import.meta.env.VITE_VISUALIZATION_API_BASE ?? "/api/visualizations",
    );
  }

  return demoRepository;
};
