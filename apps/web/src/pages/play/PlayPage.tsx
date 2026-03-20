import { Button, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useLocale, uiMessages } from "../../features/i18n";
import { VisualizationPlayer } from "../../features/visualization/player/VisualizationPlayer";
import {
  useVisualizationQuery,
  useVisualizationsQuery,
} from "../../features/visualization/queries";
import { CenteredFeedback } from "../../shared/components/CenteredFeedback";

export const PlayPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useLocale();
  const listQuery = useVisualizationsQuery();
  const query = useVisualizationQuery(id);

  if (listQuery.isPending || query.isPending) {
    return (
      <Stack
        sx={{
          minHeight: "100vh",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          backgroundColor: "background.default",
        }}
      >
        <CenteredFeedback title={t(uiMessages.loading)} loading />
      </Stack>
    );
  }

  if (listQuery.isError) {
    const errorMessage =
      listQuery.error instanceof Error ? listQuery.error.message : t(uiMessages.invalidPayload);

    return (
      <Stack
        sx={{
          minHeight: "100vh",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          backgroundColor: "background.default",
        }}
      >
        <CenteredFeedback title={t(uiMessages.errorTitle)} body={errorMessage} />
      </Stack>
    );
  }

  if (query.isError || !query.data) {
    const errorMessage =
      query.error instanceof Error ? query.error.message : t(uiMessages.invalidPayload);
    const title = errorMessage.includes("not found")
      ? t(uiMessages.notFound)
      : t(uiMessages.errorTitle);

    return (
      <Stack
        sx={{
          minHeight: "100vh",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          backgroundColor: "background.default",
        }}
      >
        <CenteredFeedback
          title={title}
          body={
            <Stack spacing={2} alignItems="center">
              <span>{errorMessage}</span>
              <Button component={RouterLink} to="/" variant="contained">
                {t(uiMessages.backHome)}
              </Button>
            </Stack>
          }
        />
      </Stack>
    );
  }

  return (
    <VisualizationPlayer
      visualization={query.data}
      visualizations={listQuery.data ?? []}
      selectedVisualizationId={id}
      onSelectVisualization={(nextId) => navigate(`/play/${nextId}`)}
    />
  );
};
