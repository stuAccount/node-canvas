import dagre from "dagre";
import {
  isGraphStep,
  type GraphStep,
  type Visualization,
} from "@node-canvas/visualization-contract";

export const NODE_WIDTH = 136;
export const NODE_HEIGHT = 76;

type GraphLayout = {
  positions: Record<string, { x: number; y: number }>;
  structure: GraphStep["structure"];
};

const getRankDirection = (structure: GraphStep["structure"]) =>
  structure === "linked-list" ? "LR" : "TB";

const getGraphEdgeKey = (
  edge: GraphStep["edges"][number],
  fallbackIndex: number,
) => edge.id ?? `${edge.source}->${edge.target}-${fallbackIndex}`;

export const buildGraphLayout = (visualization: Visualization): GraphLayout => {
  const graphSteps = visualization.steps.filter(isGraphStep);

  if (graphSteps.length === 0) {
    return {
      positions: {},
      structure: "graph",
    };
  }

  const structure = graphSteps[0].structure;
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: getRankDirection(structure),
    ranksep: structure === "linked-list" ? 90 : 118,
    nodesep: structure === "graph" ? 48 : 34,
    marginx: 36,
    marginy: 36,
  });

  const nodes = new Map<string, GraphStep["nodes"][number]>();
  const edges = new Map<string, GraphStep["edges"][number]>();

  graphSteps.forEach((step) => {
    step.nodes.forEach((node) => {
      if (!nodes.has(node.id)) {
        nodes.set(node.id, node);
      }
    });

    step.edges.forEach((edge, index) => {
      const key = getGraphEdgeKey(edge, index);
      if (!edges.has(key)) {
        edges.set(key, edge);
      }
    });
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const positions: GraphLayout["positions"] = {};

  nodes.forEach((node, id) => {
    const layoutNode = graph.node(id);

    positions[id] = node.position ?? {
      x: layoutNode.x - NODE_WIDTH / 2,
      y: layoutNode.y - NODE_HEIGHT / 2,
    };
  });

  return {
    positions,
    structure,
  };
};
