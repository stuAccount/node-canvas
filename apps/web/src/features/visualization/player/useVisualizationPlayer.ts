import { startTransition, useEffect, useEffectEvent, useMemo, useState } from "react";
import type { Visualization } from "@node-canvas/visualization-contract";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const useVisualizationPlayer = (visualization: Visualization) => {
  const totalSteps = visualization.steps.length;
  const lastStepIndex = totalSteps - 1;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(visualization.defaultSpeed ?? 1);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSpeed(visualization.defaultSpeed ?? 1);
  }, [visualization.defaultSpeed, visualization.id]);

  const goToStep = (index: number) => {
    startTransition(() => {
      setCurrentStepIndex(clamp(index, 0, lastStepIndex));
    });
  };

  const advance = useEffectEvent(() => {
    setCurrentStepIndex((index) => {
      if (index >= lastStepIndex) {
        setIsPlaying(false);
        return index;
      }

      return index + 1;
    });
  });

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    if (currentStepIndex >= lastStepIndex) {
      setIsPlaying(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      advance();
    }, 1000 / speed);

    return () => window.clearTimeout(timeoutId);
  }, [advance, currentStepIndex, isPlaying, lastStepIndex, speed]);

  return useMemo(
    () => ({
      currentStepIndex,
      currentStep: visualization.steps[currentStepIndex],
      totalSteps,
      isPlaying,
      speed,
      setSpeed,
      setIsPlaying,
      goToStep,
      goToPrevious: () => goToStep(currentStepIndex - 1),
      goToNext: () => goToStep(currentStepIndex + 1),
      reset: () => {
        setIsPlaying(false);
        goToStep(0);
      },
    }),
    [currentStepIndex, isPlaying, speed, totalSteps, visualization.steps],
  );
};
