import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { demoVisualizationDefinitions } from "@node-canvas/visualization-contract";
import { useVisualizationPlayer } from "./useVisualizationPlayer";

describe("useVisualizationPlayer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts from the first step with the visualization default speed", () => {
    const { result } = renderHook(() =>
      useVisualizationPlayer(demoVisualizationDefinitions[0].visualization),
    );

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.speed).toBe(1);
  });

  it("plays forward and pauses at the last step", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useVisualizationPlayer(demoVisualizationDefinitions[0].visualization),
    );

    await act(async () => {
      result.current.setIsPlaying(true);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(result.current.currentStepIndex).toBe(1);

    await act(async () => {
      result.current.goToStep(result.current.totalSteps - 1);
      result.current.setIsPlaying(true);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(result.current.currentStepIndex).toBe(result.current.totalSteps - 1);
    expect(result.current.isPlaying).toBe(false);
  });

  it("clamps previous and next navigation", () => {
    const { result } = renderHook(() =>
      useVisualizationPlayer(demoVisualizationDefinitions[0].visualization),
    );

    act(() => {
      result.current.goToPrevious();
    });

    expect(result.current.currentStepIndex).toBe(0);

    act(() => {
      result.current.goToStep(999);
    });

    expect(result.current.currentStepIndex).toBe(result.current.totalSteps - 1);
  });

  it("resets and updates speed", () => {
    const { result } = renderHook(() =>
      useVisualizationPlayer(demoVisualizationDefinitions[0].visualization),
    );

    act(() => {
      result.current.goToNext();
      result.current.setSpeed(1.5);
      result.current.reset();
    });

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.speed).toBe(1.5);
    expect(result.current.isPlaying).toBe(false);
  });

  it("resets when the visualization id changes", () => {
    const { result, rerender } = renderHook(
      ({ visualization }) => useVisualizationPlayer(visualization),
      {
        initialProps: {
          visualization: demoVisualizationDefinitions[0].visualization,
        },
      },
    );

    act(() => {
      result.current.goToStep(3);
      result.current.setSpeed(2);
    });

    rerender({
      visualization: demoVisualizationDefinitions[1].visualization,
    });

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.speed).toBe(1);
  });
});
