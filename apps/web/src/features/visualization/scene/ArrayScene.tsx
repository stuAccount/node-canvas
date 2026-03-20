import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useLocale } from "../../i18n";
import {
  resolveLocalizedText,
  type Locale,
  type ArrayPointer,
  type ArrayStep,
} from "@node-canvas/visualization-contract";

type ArraySceneProps = {
  step: ArrayStep;
  slotCount: number;
  maxValue: number;
};

const stateColorMap: Record<string, string> = {
  active: "#113d5a",
  compare: "#d97941",
  sorted: "#3d8f61",
  pivot: "#7d5bd6",
  swap: "#d84f57",
  dim: "#c7c2b6",
};

const collectPointersByIndex = (pointerLabels: ArrayPointer[] | undefined, locale: Locale) => {
  const map = new Map<number, string[]>();

  pointerLabels?.forEach((pointer) => {
    const labels = map.get(pointer.index) ?? [];
    labels.push(resolveLocalizedText(pointer.label, locale));
    map.set(pointer.index, labels);
  });

  return map;
};

export const ArrayScene = ({ step, slotCount, maxValue }: ArraySceneProps) => {
  const { locale } = useLocale();

  const stateByIndex = useMemo(() => {
    const map = new Map<number, string>();

    step.cellStates?.forEach((cellState) => {
      map.set(cellState.index, cellState.state);
    });

    return map;
  }, [step.cellStates]);

  const pointersByIndex = useMemo(
    () => collectPointersByIndex(step.pointerLabels, locale),
    [locale, step.pointerLabels],
  );

  return (
    <Stack spacing={2} sx={{ minHeight: 420, justifyContent: "flex-end" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${slotCount}, minmax(0, 1fr))`,
          gap: 1.5,
          alignItems: "end",
          minHeight: 280,
        }}
      >
        {Array.from({ length: slotCount }, (_, index) => {
          const value = step.values[index];
          const state = stateByIndex.get(index) ?? "default";
          const labels = pointersByIndex.get(index) ?? [];
          const height = value
            ? `${Math.max(18, (value / Math.max(maxValue, 1)) * 180)}px`
            : "14px";

          return (
            <Stack
              key={`${step.stepId}-${index}`}
              spacing={1}
              alignItems="stretch"
              data-testid={`array-slot-${index}`}
              sx={{ minWidth: 0 }}
            >
              <Stack
                direction="row"
                spacing={0.5}
                justifyContent="center"
                flexWrap="wrap"
                minHeight={32}
              >
                {labels.map((label) => (
                  <Typography
                    key={`${index}-${label}`}
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 999,
                      backgroundColor: "rgba(17, 61, 90, 0.08)",
                      color: "primary.dark",
                    }}
                  >
                    {label}
                  </Typography>
                ))}
              </Stack>
              <Box
                data-testid={`array-bar-${index}`}
                data-state={state}
                sx={{
                  height,
                  borderRadius: "18px 18px 8px 8px",
                  border: "1px solid rgba(17, 61, 90, 0.18)",
                  background:
                    state === "default"
                      ? "linear-gradient(180deg, rgba(17,61,90,0.16), rgba(17,61,90,0.32))"
                      : `linear-gradient(180deg, ${stateColorMap[state]}, rgba(17,61,90,0.22))`,
                  transition:
                    "height 260ms ease, background 220ms ease, transform 220ms ease",
                  transform:
                    state === "compare" || state === "active" ? "translateY(-6px)" : "none",
                  boxShadow:
                    state === "swap"
                      ? "0 18px 28px rgba(216,79,87,0.22)"
                      : "0 8px 18px rgba(17,61,90,0.12)",
                }}
              />
              <Box
                sx={{
                  borderRadius: 3,
                  border: "1px solid rgba(17, 61, 90, 0.12)",
                  backgroundColor:
                    state === "default" ? "rgba(255,255,255,0.86)" : "rgba(255,250,242,0.98)",
                  px: 1,
                  py: 1.25,
                  textAlign: "center",
                }}
              >
                <Typography variant="h3" component="div">
                  {value ?? "–"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  #{index}
                </Typography>
              </Box>
            </Stack>
          );
        })}
      </Box>
    </Stack>
  );
};
