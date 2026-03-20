import type { LocalizedText } from "./localization";

export type VisualizationSceneKind = "array" | "graph";

export type VisualizationSummary = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  sceneKinds: VisualizationSceneKind[];
  tags: LocalizedText[];
};

export type Visualization = {
  schemaVersion: 1;
  id: string;
  title: LocalizedText;
  summary?: LocalizedText;
  defaultSpeed?: number;
  steps: VisualizationStep[];
};

export type VisualizationStep = ArrayStep | GraphStep;

export type ArrayStep = {
  stepId: string;
  type: "array";
  values: number[];
  cellStates?: ArrayCellState[];
  pointerLabels?: ArrayPointer[];
  message?: LocalizedText;
};

export type GraphStep = {
  stepId: string;
  type: "graph";
  structure: "graph" | "tree" | "linked-list" | "heap";
  nodes: GraphNode[];
  edges: GraphEdge[];
  focusIds?: string[];
  message?: LocalizedText;
};

export type ArrayCellState = {
  index: number;
  state: "active" | "compare" | "sorted" | "pivot" | "swap" | "dim";
};

export type ArrayPointer = {
  index: number;
  label: LocalizedText;
};

export type GraphNode = {
  id: string;
  label: LocalizedText;
  state?: "default" | "active" | "visited" | "frontier" | "done";
  position?: {
    x: number;
    y: number;
  };
};

export type GraphEdge = {
  id?: string;
  source: string;
  target: string;
  label?: LocalizedText;
  state?: "default" | "active" | "visited" | "candidate" | "done";
};

export const isArrayStep = (step: VisualizationStep): step is ArrayStep =>
  step.type === "array";

export const isGraphStep = (step: VisualizationStep): step is GraphStep =>
  step.type === "graph";
