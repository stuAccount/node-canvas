import {
  Box,
  Button,
  Chip,
  Divider,
  InputBase,
  MenuItem,
  Slider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  isArrayStep,
  resolveLocalizedText,
  type Visualization,
  type VisualizationSummary,
} from "@node-canvas/visualization-contract";
import { useLocale, uiMessages } from "../../i18n";
import { LocaleToggle } from "../../../shared/components/LocaleToggle";
import { ThemeModeToggle } from "../../../shared/components/ThemeModeToggle";
import { ArrayScene } from "../scene/ArrayScene";
import { NodeEdgeScene } from "../scene/NodeEdgeScene";
import { useVisualizationPlayer } from "./useVisualizationPlayer";

const AVAILABLE_SPEEDS = [0.5, 1, 1.5, 2];

const tabLabelByValue = {
  readme: uiMessages.readmeTab,
  source: uiMessages.sourceTab,
  snapshot: uiMessages.dataTab,
} as const;

const getArrayMetrics = (visualization: Visualization) => {
  const arraySteps = visualization.steps.filter(isArrayStep);

  return {
    slotCount: arraySteps.reduce(
      (max, step) => Math.max(max, step.values.length),
      0,
    ),
    maxValue: arraySteps.reduce(
      (max, step) => Math.max(max, ...step.values),
      0,
    ),
  };
};

const getWorkbenchColors = (isDark: boolean) =>
  isDark
    ? {
        root: "#171717",
        topBar: "#2b2b2b",
        panel: "#232323",
        panelAlt: "#1f1f1f",
        stage: "#1d1d1d",
        search: "#303030",
        meta: "#2b2b2b",
        text: "rgba(255,255,255,0.94)",
        subtext: "rgba(255,255,255,0.58)",
        border: "rgba(255,255,255,0.08)",
        accent: "#12d978",
        accentText: "#101010",
        accentSoft: "rgba(18,217,120,0.14)",
        itemActive: "rgba(255,255,255,0.06)",
        itemHover: "rgba(255,255,255,0.04)",
        code: "#d5d5d5",
      }
    : {
        root: "#efe7da",
        topBar: "#f7f0e5",
        panel: "#fff8ee",
        panelAlt: "#fffdf8",
        stage: "#f5ecdf",
        search: "#f1e7d9",
        meta: "#faf1e4",
        text: "#1f2d3a",
        subtext: "#6a6f75",
        border: "rgba(17,61,90,0.12)",
        accent: "#113d5a",
        accentText: "#f5efe6",
        accentSoft: "rgba(17,61,90,0.08)",
        itemActive: "rgba(17,61,90,0.08)",
        itemHover: "rgba(17,61,90,0.05)",
        code: "#24313b",
      };

const getSectionedVisualizations = (visualizations: VisualizationSummary[]) => ({
  algorithms: visualizations,
  dataStructures: [] as VisualizationSummary[],
});

const matchesFilter = (
  visualization: VisualizationSummary,
  query: string,
  locale: "en" | "zh",
) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const haystacks = [
    resolveLocalizedText(visualization.title, locale),
    resolveLocalizedText(visualization.summary, locale),
    ...visualization.tags.map((tag) => resolveLocalizedText(tag, locale)),
  ];

  return haystacks.some((value) => value.toLowerCase().includes(normalizedQuery));
};

export const VisualizationPlayer = ({
  visualization,
  visualizations,
  selectedVisualizationId,
  onSelectVisualization,
}: {
  visualization: Visualization;
  visualizations: VisualizationSummary[];
  selectedVisualizationId: string;
  onSelectVisualization: (id: string) => void;
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const colors = useMemo(() => getWorkbenchColors(isDark), [isDark]);
  const { t, locale } = useLocale();
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    speed,
    setSpeed,
    setIsPlaying,
    goToNext,
    goToPrevious,
    goToStep,
    reset,
  } = useVisualizationPlayer(visualization);

  const [activeTab, setActiveTab] = useState<keyof typeof tabLabelByValue>("source");
  const [filterQuery, setFilterQuery] = useState("");
  const arrayMetrics = useMemo(() => getArrayMetrics(visualization), [visualization]);
  const sections = useMemo(
    () => getSectionedVisualizations(visualizations),
    [visualizations],
  );
  const filteredAlgorithms = useMemo(
    () =>
      sections.algorithms.filter((entry) =>
        matchesFilter(entry, filterQuery, locale),
      ),
    [filterQuery, locale, sections.algorithms],
  );
  const filteredStructures = useMemo(
    () =>
      sections.dataStructures.filter((entry) =>
        matchesFilter(entry, filterQuery, locale),
      ),
    [filterQuery, locale, sections.dataStructures],
  );

  const sceneTitle =
    currentStep.type === "array" ? t(uiMessages.arrayScene) : t(uiMessages.graphScene);
  const resolvedTitle = resolveLocalizedText(visualization.title, locale);
  const resolvedSummary = visualization.summary
    ? resolveLocalizedText(visualization.summary, locale)
    : null;
  const resolvedMessage = currentStep.message
    ? resolveLocalizedText(currentStep.message, locale)
    : "—";
  const stepSnapshot = useMemo(
    () => JSON.stringify(currentStep, null, 2),
    [currentStep],
  );

  const sourcePreview = [
    "// Source code placeholder",
    "// Replace this file with your own implementation.",
    "",
    `export const visualizationId = "${visualization.id}";`,
    `export const currentStepId = "${currentStep.stepId}";`,
    "",
    "export function runVisualization() {",
    `  // scene: "${currentStep.type}"`,
    `  // step: ${currentStepIndex + 1} / ${totalSteps}`,
    "  // TODO: inject your own code here.",
    "}",
  ].join("\n");

  const readmePreview = [
    `# ${resolvedTitle}`,
    "",
    resolvedSummary ?? "",
    "",
    `- ${t(uiMessages.currentScene)}: ${sceneTitle}`,
    `- ${t(uiMessages.steps)}: ${currentStepIndex + 1} / ${totalSteps}`,
    `- ${t(uiMessages.message)}: ${resolvedMessage}`,
    "",
    t(uiMessages.workspaceHint),
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.root,
        color: colors.text,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.topBar,
          }}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack spacing={0.5}>
              <Typography
                variant="body2"
                sx={{ color: colors.subtext, letterSpacing: "0.06em" }}
              >
                {t(uiMessages.playground)} / {sceneTitle}
              </Typography>
              <Typography component="h1" variant="h2" sx={{ color: colors.text }}>
                {resolvedTitle}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={`${t(uiMessages.steps)} ${currentStepIndex + 1} / ${totalSteps}`}
                sx={{
                  borderRadius: 999,
                  backgroundColor: colors.accentSoft,
                  color: isDark ? "#8ef0ba" : colors.accent,
                  border: `1px solid ${colors.border}`,
                }}
              />
              <ThemeModeToggle dark={isDark} />
              <LocaleToggle dark={isDark} />
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                sx={{
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                {t(uiMessages.backHome)}
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "300px minmax(0, 1fr) 380px",
              xl: "320px minmax(0, 1fr) 420px",
            },
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              borderRight: { lg: `1px solid ${colors.border}` },
              borderBottom: { xs: `1px solid ${colors.border}`, lg: "none" },
              backgroundColor: colors.panel,
              display: "flex",
              flexDirection: "column",
              minHeight: { xs: 320, lg: "auto" },
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
              <Typography variant="overline" sx={{ color: colors.subtext }}>
                {t(uiMessages.optionsPanel)}
              </Typography>
              <Box
                sx={{
                  mt: 1.5,
                  px: 1.5,
                  py: 1,
                  borderRadius: 2.5,
                  backgroundColor: colors.search,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <InputBase
                  fullWidth
                  value={filterQuery}
                  onChange={(event) => setFilterQuery(event.target.value)}
                  placeholder={t(uiMessages.searchPlaceholder)}
                  inputProps={{ "aria-label": t(uiMessages.searchPlaceholder) }}
                  sx={{
                    color: colors.text,
                    fontSize: 14,
                  }}
                />
              </Box>
            </Box>

            <Stack spacing={2} sx={{ p: 1.5, overflow: "auto" }}>
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ color: colors.subtext }}>
                  {t(uiMessages.algorithmsSection)}
                </Typography>
                <Stack spacing={0.5}>
                  {filteredAlgorithms.map((entry) => {
                    const selected = entry.id === selectedVisualizationId;

                    return (
                      <Box
                        key={entry.id}
                        component="button"
                        type="button"
                        onClick={() => onSelectVisualization(entry.id)}
                        sx={{
                          width: "100%",
                          textAlign: "left",
                          border: `1px solid ${selected ? colors.border : "transparent"}`,
                          backgroundColor: selected ? colors.itemActive : "transparent",
                          color: selected ? colors.text : colors.subtext,
                          px: 1.5,
                          py: 1.35,
                          borderRadius: 2,
                          cursor: "pointer",
                          transition: "background-color 160ms ease",
                          "&:hover": {
                            backgroundColor: colors.itemHover,
                          },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: selected ? 700 : 500 }}>
                          {resolveLocalizedText(entry.title, locale)}
                        </Typography>
                      </Box>
                    );
                  })}
                  {filteredAlgorithms.length === 0 ? (
                    <Typography variant="body2" sx={{ color: colors.subtext, px: 1.5, py: 1 }}>
                      {t(uiMessages.emptyCollection)}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>

              <Divider sx={{ borderColor: colors.border }} />

              <Stack spacing={1}>
                <Typography variant="overline" sx={{ color: colors.subtext }}>
                  {t(uiMessages.dataStructuresSection)}
                </Typography>
                {filteredStructures.length === 0 ? (
                  <Typography variant="body2" sx={{ color: colors.subtext, px: 1.5, py: 1 }}>
                    {t(uiMessages.emptyCollection)}
                  </Typography>
                ) : (
                  <Stack spacing={0.5}>
                    {filteredStructures.map((entry) => (
                      <Box
                        key={entry.id}
                        component="button"
                        type="button"
                        onClick={() => onSelectVisualization(entry.id)}
                        sx={{
                          width: "100%",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          color: colors.subtext,
                          px: 1.5,
                          py: 1.35,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: colors.itemHover,
                          },
                        }}
                      >
                        {resolveLocalizedText(entry.title, locale)}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ borderColor: colors.border }} />

              <Stack spacing={1.25}>
                <Typography variant="overline" sx={{ color: colors.subtext }}>
                  {t(uiMessages.metadata)}
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    backgroundColor: colors.meta,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ color: colors.subtext }}>
                      {t(uiMessages.visualizationId)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text }}>
                      {visualization.id}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.subtext }}>
                      {t(uiMessages.schema)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text }}>
                      {visualization.schemaVersion}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.subtext }}>
                      {t(uiMessages.supportedScenes)}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {Array.from(new Set(visualization.steps.map((step) => step.type))).map(
                        (type) => (
                          <Chip
                            key={type}
                            label={
                              type === "array"
                                ? t(uiMessages.arrayScene)
                                : t(uiMessages.graphScene)
                            }
                            size="small"
                            sx={{
                              borderRadius: 999,
                              backgroundColor: colors.accentSoft,
                              color: colors.text,
                            }}
                          />
                        ),
                      )}
                    </Stack>
                  </Stack>
                </Box>
                <Typography variant="body2" sx={{ color: colors.subtext }}>
                  {t(uiMessages.structurePlaceholder)}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "auto minmax(0, 1fr) auto",
              minHeight: { xs: 720, lg: "auto" },
              backgroundColor: colors.panelAlt,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: colors.panel,
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", xl: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      onClick={goToPrevious}
                      disabled={currentStepIndex === 0}
                      sx={{ color: colors.text }}
                    >
                      {t(uiMessages.previous)}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setIsPlaying((current) => !current)}
                      sx={{
                        backgroundColor: colors.accent,
                        color: colors.accentText,
                        "&:hover": {
                          backgroundColor: colors.accent,
                          opacity: 0.92,
                        },
                      }}
                    >
                      {isPlaying ? t(uiMessages.pause) : t(uiMessages.play)}
                    </Button>
                    <Button
                      onClick={goToNext}
                      disabled={currentStepIndex === totalSteps - 1}
                      sx={{ color: colors.text }}
                    >
                      {t(uiMessages.next)}
                    </Button>
                    <Button onClick={reset} sx={{ color: colors.text }}>
                      {t(uiMessages.reset)}
                    </Button>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={sceneTitle}
                      sx={{
                        borderRadius: 999,
                        backgroundColor: colors.accentSoft,
                        color: colors.text,
                      }}
                    />
                    <TextField
                      select
                      size="small"
                      label={t(uiMessages.speed)}
                      value={speed}
                      onChange={(event) => setSpeed(Number(event.target.value))}
                      sx={{
                        minWidth: 110,
                        "& .MuiInputBase-root": {
                          color: colors.text,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.border,
                        },
                        "& .MuiInputLabel-root": {
                          color: colors.subtext,
                        },
                        "& .MuiSvgIcon-root": {
                          color: colors.subtext,
                        },
                      }}
                    >
                      {AVAILABLE_SPEEDS.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}x
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Stack>

                <Box sx={{ px: 1 }}>
                  <Slider
                    aria-label="visualization progress"
                    min={0}
                    max={totalSteps - 1}
                    step={1}
                    value={currentStepIndex}
                    onChange={(_, nextValue) => {
                      if (typeof nextValue === "number") {
                        goToStep(nextValue);
                      }
                    }}
                    sx={{
                      color: colors.accent,
                      "& .MuiSlider-rail": {
                        backgroundColor: colors.border,
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                p: { xs: 2, md: 3 },
                minHeight: 0,
                backgroundColor: colors.stage,
              }}
            >
              <Stack spacing={2} sx={{ height: "100%" }}>
                <Typography
                  variant="overline"
                  sx={{ color: colors.subtext, letterSpacing: "0.08em" }}
                >
                  {t(uiMessages.stagePanel)}
                </Typography>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  {currentStep.type === "array" ? (
                    <ArrayScene
                      step={currentStep}
                      slotCount={arrayMetrics.slotCount}
                      maxValue={arrayMetrics.maxValue}
                    />
                  ) : (
                    <NodeEdgeScene visualization={visualization} step={currentStep} />
                  )}
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: colors.panel,
              }}
            >
              <Typography variant="overline" sx={{ color: colors.subtext }}>
                {t(uiMessages.message)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: colors.text }}>
                {resolvedMessage}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              borderLeft: { lg: `1px solid ${colors.border}` },
              borderTop: { xs: `1px solid ${colors.border}`, lg: "none" },
              display: "grid",
              gridTemplateRows: "auto minmax(0, 1fr)",
              minHeight: { xs: 420, lg: "auto" },
              backgroundColor: colors.panel,
            }}
          >
            <Box sx={{ borderBottom: `1px solid ${colors.border}` }}>
              <Tabs
                value={activeTab}
                onChange={(_, value: keyof typeof tabLabelByValue) => setActiveTab(value)}
                variant="scrollable"
                scrollButtons={false}
                textColor="inherit"
                sx={{
                  minHeight: 48,
                  "& .MuiTabs-indicator": {
                    backgroundColor: colors.accent,
                  },
                }}
              >
                {(Object.keys(tabLabelByValue) as Array<keyof typeof tabLabelByValue>).map(
                  (tab) => (
                    <Tab
                      key={tab}
                      value={tab}
                      label={t(tabLabelByValue[tab])}
                      sx={{
                        minHeight: 48,
                        color: colors.subtext,
                      }}
                    />
                  ),
                )}
              </Tabs>
            </Box>

            <Box
              sx={{
                minHeight: 0,
                overflow: "auto",
                p: 2,
                backgroundColor: colors.panelAlt,
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: colors.subtext, letterSpacing: "0.08em" }}
              >
                {activeTab === "snapshot"
                  ? t(uiMessages.stepSnapshot)
                  : activeTab === "readme"
                    ? t(uiMessages.summary)
                    : t(uiMessages.codePanel)}
              </Typography>

              <Box
                component="pre"
                sx={{
                  mt: 1.5,
                  mb: 0,
                  p: 0,
                  color: colors.code,
                  fontFamily:
                    '"SFMono-Regular", "JetBrains Mono", "Fira Code", monospace',
                  fontSize: 14,
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {activeTab === "readme"
                  ? readmePreview
                  : activeTab === "snapshot"
                    ? stepSnapshot
                    : sourcePreview}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
