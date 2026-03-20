import { z } from "zod";
import type {
  Visualization,
  VisualizationSummary,
} from "./protocol";

const localizedTextSchema = z.union([
  z.string().min(1),
  z.object({
    en: z.string().min(1),
    zh: z.string().min(1).optional(),
  }),
]);

const arrayCellStateSchema = z.object({
  index: z.number().int().nonnegative(),
  state: z.enum(["active", "compare", "sorted", "pivot", "swap", "dim"]),
});

const arrayPointerSchema = z.object({
  index: z.number().int().nonnegative(),
  label: localizedTextSchema,
});

const graphNodeSchema = z.object({
  id: z.string().min(1),
  label: localizedTextSchema,
  state: z
    .enum(["default", "active", "visited", "frontier", "done"])
    .optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
});

const graphEdgeSchema = z.object({
  id: z.string().min(1).optional(),
  source: z.string().min(1),
  target: z.string().min(1),
  label: localizedTextSchema.optional(),
  state: z.enum(["default", "active", "visited", "candidate", "done"]).optional(),
});

const arrayStepSchema = z
  .object({
    stepId: z.string().min(1),
    type: z.literal("array"),
    values: z.array(z.number()).min(1),
    cellStates: z.array(arrayCellStateSchema).optional(),
    pointerLabels: z.array(arrayPointerSchema).optional(),
    message: localizedTextSchema.optional(),
  })
  .superRefine((step, ctx) => {
    for (const cellState of step.cellStates ?? []) {
      if (cellState.index >= step.values.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cellStates"],
          message: `Cell state index ${cellState.index} is out of bounds.`,
        });
      }
    }

    for (const pointer of step.pointerLabels ?? []) {
      if (pointer.index >= step.values.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pointerLabels"],
          message: `Pointer index ${pointer.index} is out of bounds.`,
        });
      }
    }
  });

const graphStepSchema = z
  .object({
    stepId: z.string().min(1),
    type: z.literal("graph"),
    structure: z.enum(["graph", "tree", "linked-list", "heap"]),
    nodes: z.array(graphNodeSchema).min(1),
    edges: z.array(graphEdgeSchema),
    focusIds: z.array(z.string().min(1)).optional(),
    message: localizedTextSchema.optional(),
  })
  .superRefine((step, ctx) => {
    const nodeIds = new Set<string>();

    step.nodes.forEach((node, index) => {
      if (nodeIds.has(node.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["nodes", index, "id"],
          message: `Duplicate node id "${node.id}".`,
        });
      }

      nodeIds.add(node.id);
    });

    step.edges.forEach((edge, index) => {
      if (!nodeIds.has(edge.source)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["edges", index, "source"],
          message: `Edge source "${edge.source}" does not exist.`,
        });
      }

      if (!nodeIds.has(edge.target)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["edges", index, "target"],
          message: `Edge target "${edge.target}" does not exist.`,
        });
      }
    });

    for (const focusId of step.focusIds ?? []) {
      if (!nodeIds.has(focusId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["focusIds"],
          message: `Focused node "${focusId}" does not exist.`,
        });
      }
    }
  });

export const visualizationStepSchema = z.discriminatedUnion("type", [
  arrayStepSchema,
  graphStepSchema,
]);

export const visualizationSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    title: localizedTextSchema,
    summary: localizedTextSchema.optional(),
    defaultSpeed: z.number().positive().max(4).optional(),
    steps: z.array(visualizationStepSchema).min(1),
  })
  .superRefine((visualization, ctx) => {
    const stepIds = new Set<string>();

    visualization.steps.forEach((step, index) => {
      if (stepIds.has(step.stepId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["steps", index, "stepId"],
          message: `Duplicate step id "${step.stepId}".`,
        });
      }

      stepIds.add(step.stepId);
    });
  });

export const visualizationSummarySchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  sceneKinds: z.array(z.enum(["array", "graph"])).min(1),
  tags: z.array(localizedTextSchema),
});

export const visualizationSummaryListSchema = z.array(visualizationSummarySchema);

const formatIssues = (error: z.ZodError) =>
  error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `${path}: ${issue.message}`;
    })
    .join("; ");

export const parseVisualization = (input: unknown): Visualization => {
  const parsed = visualizationSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(`Invalid visualization payload: ${formatIssues(parsed.error)}`);
  }

  return {
    ...parsed.data,
    defaultSpeed: parsed.data.defaultSpeed ?? 1,
  } as Visualization;
};

export const parseVisualizationSummary = (input: unknown): VisualizationSummary => {
  const parsed = visualizationSummarySchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(`Invalid visualization summary: ${formatIssues(parsed.error)}`);
  }

  return parsed.data as VisualizationSummary;
};

export const parseVisualizationSummaryList = (
  input: unknown,
): VisualizationSummary[] => {
  const parsed = visualizationSummaryListSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(`Invalid visualization summary list: ${formatIssues(parsed.error)}`);
  }

  return parsed.data as VisualizationSummary[];
};

