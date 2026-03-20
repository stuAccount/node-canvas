import { useQuery } from "@tanstack/react-query";
import { useVisualizationRepository } from "./repository";

export const visualizationKeys = {
  all: ["visualizations"] as const,
  detail: (id: string) => ["visualizations", id] as const,
};

export const useVisualizationsQuery = () => {
  const repository = useVisualizationRepository();

  return useQuery({
    queryKey: visualizationKeys.all,
    queryFn: () => repository.listVisualizations(),
  });
};

export const useVisualizationQuery = (id: string) => {
  const repository = useVisualizationRepository();

  return useQuery({
    queryKey: visualizationKeys.detail(id),
    queryFn: () => repository.getVisualization(id),
    enabled: id.length > 0,
  });
};

