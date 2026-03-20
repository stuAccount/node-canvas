import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocale, uiMessages } from "../../features/i18n";
import { VisualizationPlayer } from "../../features/visualization/player/VisualizationPlayer";
import {
  useVisualizationQuery,
  useVisualizationsQuery,
} from "../../features/visualization/queries";
import { CenteredFeedback } from "../../shared/components/CenteredFeedback";

export const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const listQuery = useVisualizationsQuery();
  const defaultVisualizationId = listQuery.data?.[0]?.id ?? "";
  const visualizationQuery = useVisualizationQuery(defaultVisualizationId);

  if (listQuery.isPending || (defaultVisualizationId.length > 0 && visualizationQuery.isPending)) {
    return (
      <Stack sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <CenteredFeedback title={t(uiMessages.loading)} loading />
      </Stack>
    );
  }

  if (listQuery.isError) {
    return (
      <Stack sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <CenteredFeedback
          title={t(uiMessages.errorTitle)}
          body={
            listQuery.error instanceof Error
              ? listQuery.error.message
              : t(uiMessages.invalidPayload)
          }
        />
      </Stack>
    );
  }

  if (!listQuery.data?.length) {
    return (
      <Stack sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <CenteredFeedback title={t(uiMessages.emptyState)} />
      </Stack>
    );
  }

  if (visualizationQuery.isError || !visualizationQuery.data) {
    return (
      <Stack sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <CenteredFeedback
          title={t(uiMessages.errorTitle)}
          body={
            visualizationQuery.error instanceof Error
              ? visualizationQuery.error.message
              : t(uiMessages.invalidPayload)
          }
        />
      </Stack>
    );
  }

  return (
    <VisualizationPlayer
      visualization={visualizationQuery.data}
      visualizations={listQuery.data}
      selectedVisualizationId={defaultVisualizationId}
      onSelectVisualization={(id) => navigate(`/play/${id}`)}
    />
  );
};
