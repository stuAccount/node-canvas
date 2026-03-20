import {
  Background,
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  Position,
  ReactFlow,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Box, Typography } from "@mui/material";
import { memo, useMemo } from "react";
import { useLocale } from "../../i18n";
import {
  resolveLocalizedText,
  type GraphStep,
  type Visualization,
} from "@node-canvas/visualization-contract";
import { buildGraphLayout } from "./layoutGraph";

type VisualizationNodeData = {
  label: string;
  state: NonNullable<GraphStep["nodes"][number]["state"]> | "default";
  focused: boolean;
  orientation: "horizontal" | "vertical";
};

type VisualizationEdgeData = {
  label?: string;
  state: NonNullable<GraphStep["edges"][number]["state"]> | "default";
};

type NodeEdgeSceneProps = {
  visualization: Visualization;
  step: GraphStep;
};

const graphNodeColors: Record<VisualizationNodeData["state"], string> = {
  default: "#ffffff",
  active: "#d97941",
  visited: "#8bb2ca",
  frontier: "#f3d7b8",
  done: "#6ca57f",
};

const graphEdgeColors: Record<VisualizationEdgeData["state"], string> = {
  default: "#97a3ad",
  active: "#d97941",
  visited: "#4b7189",
  candidate: "#d3b28d",
  done: "#6ca57f",
};

const VisualizationNode = memo(({ id, data }: NodeProps<Node<VisualizationNodeData>>) => {
  const targetPosition =
    data.orientation === "horizontal" ? Position.Left : Position.Top;
  const sourcePosition =
    data.orientation === "horizontal" ? Position.Right : Position.Bottom;

  return (
    <Box
      data-testid={`graph-node-${id}`}
      data-state={data.state}
      sx={{
        minWidth: 124,
        px: 2,
        py: 1.5,
        borderRadius: 4,
        border: "1px solid rgba(17, 61, 90, 0.18)",
        backgroundColor: graphNodeColors[data.state],
        boxShadow: data.focused
          ? "0 0 0 4px rgba(217,121,65,0.2), 0 18px 26px rgba(17,61,90,0.12)"
          : "0 12px 20px rgba(17,61,90,0.08)",
        textAlign: "center",
      }}
    >
      <Handle
        type="target"
        position={targetPosition}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <Typography variant="h3" component="div">
        {data.label}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {data.state}
      </Typography>
      <Handle
        type="source"
        position={sourcePosition}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
    </Box>
  );
});

const VisualizationEdge = memo((props: EdgeProps<Edge<VisualizationEdgeData>>) => {
  const [path, labelX, labelY] = getSmoothStepPath(props);
  const state = props.data?.state ?? "default";
  const label = props.data?.label;

  return (
    <>
      <BaseEdge
        id={props.id}
        path={path}
        style={{
          stroke: graphEdgeColors[state],
          strokeWidth: state === "active" ? 3 : 2,
        }}
      />
      {label ? (
        <EdgeLabelRenderer>
          <Box
            data-testid={`graph-edge-label-${props.id}`}
            data-state={state}
            sx={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              px: 1,
              py: 0.25,
              borderRadius: 999,
              backgroundColor: "rgba(255,250,242,0.9)",
              border: "1px solid rgba(17, 61, 90, 0.12)",
              pointerEvents: "none",
              fontSize: 12,
            }}
          >
            {label}
          </Box>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
});

const nodeTypes = {
  visualNode: VisualizationNode,
};

const edgeTypes = {
  visualEdge: VisualizationEdge,
};

export const mapGraphStepToFlow = ({
  step,
  layoutPositions,
  locale,
}: {
  step: GraphStep;
  layoutPositions: Record<string, { x: number; y: number }>;
  locale: "en" | "zh";
}) => {
  const orientation = step.structure === "linked-list" ? "horizontal" : "vertical";

  const nodes: Node[] = step.nodes.map((node) => ({
    id: node.id,
    type: "visualNode",
    position: layoutPositions[node.id] ?? node.position ?? { x: 0, y: 0 },
    draggable: false,
    selectable: false,
    data: {
      label: resolveLocalizedText(node.label, locale),
      state: node.state ?? "default",
      focused: step.focusIds?.includes(node.id) ?? false,
      orientation,
    },
  }));

  const edges: Edge[] = step.edges.map((edge, index) => ({
    id: edge.id ?? `${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    type: "visualEdge",
    selectable: false,
    data: {
      label: edge.label ? resolveLocalizedText(edge.label, locale) : undefined,
      state: edge.state ?? "default",
    },
  }));

  return { nodes, edges };
};

export const NodeEdgeScene = ({ visualization, step }: NodeEdgeSceneProps) => {
  const { locale } = useLocale();
  const layout = useMemo(() => buildGraphLayout(visualization), [visualization]);
  const flowScene = useMemo(
    () =>
      mapGraphStepToFlow({
        step,
        layoutPositions: layout.positions,
        locale,
      }),
    [layout.positions, locale, step],
  );

  return (
    <Box sx={{ minHeight: 420, height: "100%" }}>
      <ReactFlow
        nodes={flowScene.nodes}
        edges={flowScene.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(17, 61, 90, 0.08)" gap={24} />
      </ReactFlow>
    </Box>
  );
};
