import type { Visualization, VisualizationSummary } from "./protocol";
import { parseVisualization, parseVisualizationSummary } from "./schema";

type DemoVisualizationDefinition = {
  summary: VisualizationSummary;
  visualization: Visualization;
};

const bubbleSortDefinition: DemoVisualizationDefinition = {
  summary: parseVisualizationSummary({
    id: "bubble-sort",
    title: {
      en: "Bubble Sort",
      zh: "冒泡排序",
    },
    summary: {
      en: "A compact sorting walkthrough that shows comparisons, swaps, and sorted slots.",
      zh: "一个紧凑的排序演示，展示比较、交换和已完成排序的位置。",
    },
    sceneKinds: ["array"],
    tags: [
      {
        en: "Sorting",
        zh: "排序",
      },
      {
        en: "Array",
        zh: "数组",
      },
    ],
  }),
  visualization: parseVisualization({
    schemaVersion: 1,
    id: "bubble-sort",
    title: {
      en: "Bubble Sort",
      zh: "冒泡排序",
    },
    summary: {
      en: "Every step is a full array snapshot so the player stays simple and predictable.",
      zh: "每一步都是完整数组快照，让播放器保持简单且可预测。",
    },
    defaultSpeed: 1,
    steps: [
      {
        stepId: "bubble-1",
        type: "array",
        values: [7, 3, 5, 1],
        cellStates: [
          { index: 0, state: "compare" },
          { index: 1, state: "compare" },
        ],
        pointerLabels: [
          {
            index: 0,
            label: {
              en: "left",
              zh: "左指针",
            },
          },
          {
            index: 1,
            label: {
              en: "right",
              zh: "右指针",
            },
          },
        ],
        message: {
          en: "Compare 7 and 3.",
          zh: "比较 7 和 3。",
        },
      },
      {
        stepId: "bubble-2",
        type: "array",
        values: [3, 7, 5, 1],
        cellStates: [
          { index: 0, state: "swap" },
          { index: 1, state: "swap" },
        ],
        message: {
          en: "Swap them because 7 is larger.",
          zh: "因为 7 更大，所以交换。",
        },
      },
      {
        stepId: "bubble-3",
        type: "array",
        values: [3, 7, 5, 1],
        cellStates: [
          { index: 1, state: "compare" },
          { index: 2, state: "compare" },
        ],
        pointerLabels: [
          {
            index: 1,
            label: {
              en: "left",
              zh: "左指针",
            },
          },
          {
            index: 2,
            label: {
              en: "right",
              zh: "右指针",
            },
          },
        ],
        message: {
          en: "Compare 7 and 5.",
          zh: "比较 7 和 5。",
        },
      },
      {
        stepId: "bubble-4",
        type: "array",
        values: [3, 5, 7, 1],
        cellStates: [
          { index: 1, state: "swap" },
          { index: 2, state: "swap" },
        ],
        message: {
          en: "Swap again and keep the larger item drifting right.",
          zh: "再次交换，让较大的元素继续向右移动。",
        },
      },
      {
        stepId: "bubble-5",
        type: "array",
        values: [3, 5, 7, 1],
        cellStates: [
          { index: 2, state: "compare" },
          { index: 3, state: "compare" },
        ],
        pointerLabels: [
          {
            index: 2,
            label: {
              en: "left",
              zh: "左指针",
            },
          },
          {
            index: 3,
            label: {
              en: "right",
              zh: "右指针",
            },
          },
        ],
        message: {
          en: "Compare 7 and 1.",
          zh: "比较 7 和 1。",
        },
      },
      {
        stepId: "bubble-6",
        type: "array",
        values: [3, 5, 1, 7],
        cellStates: [
          { index: 2, state: "swap" },
          { index: 3, state: "sorted" },
        ],
        message: {
          en: "7 reaches its final slot at the end.",
          zh: "7 到达最终位置。",
        },
      },
      {
        stepId: "bubble-7",
        type: "array",
        values: [3, 5, 1, 7],
        cellStates: [
          { index: 1, state: "compare" },
          { index: 2, state: "compare" },
          { index: 3, state: "sorted" },
        ],
        message: {
          en: "In the next pass, compare 5 and 1.",
          zh: "在下一轮中，比较 5 和 1。",
        },
      },
      {
        stepId: "bubble-8",
        type: "array",
        values: [3, 1, 5, 7],
        cellStates: [
          { index: 1, state: "swap" },
          { index: 2, state: "sorted" },
          { index: 3, state: "sorted" },
        ],
        message: {
          en: "Swap them so 5 can settle behind 7.",
          zh: "交换它们，让 5 落在 7 前面。",
        },
      },
      {
        stepId: "bubble-9",
        type: "array",
        values: [3, 1, 5, 7],
        cellStates: [
          { index: 0, state: "compare" },
          { index: 1, state: "compare" },
          { index: 2, state: "sorted" },
          { index: 3, state: "sorted" },
        ],
        message: {
          en: "One final comparison puts the smallest value first.",
          zh: "最后一次比较会把最小值放到最前面。",
        },
      },
      {
        stepId: "bubble-10",
        type: "array",
        values: [1, 3, 5, 7],
        cellStates: [
          { index: 0, state: "sorted" },
          { index: 1, state: "sorted" },
          { index: 2, state: "sorted" },
          { index: 3, state: "sorted" },
        ],
        message: {
          en: "The array is fully sorted.",
          zh: "数组已经完全有序。",
        },
      },
    ],
  }),
};

const dfsDefinition: DemoVisualizationDefinition = {
  summary: parseVisualizationSummary({
    id: "dfs-traversal",
    title: {
      en: "DFS Traversal",
      zh: "深度优先遍历",
    },
    summary: {
      en: "A node-edge walkthrough that highlights the active branch and visited nodes.",
      zh: "一个节点边遍历演示，突出当前分支和已访问节点。",
    },
    sceneKinds: ["graph"],
    tags: [
      {
        en: "Traversal",
        zh: "遍历",
      },
      {
        en: "Graph",
        zh: "图",
      },
    ],
  }),
  visualization: parseVisualization({
    schemaVersion: 1,
    id: "dfs-traversal",
    title: {
      en: "DFS Traversal",
      zh: "深度优先遍历",
    },
    summary: {
      en: "The frontend only consumes full graph snapshots, while the backend is free to use any implementation language.",
      zh: "前端只消费完整图快照，而后端可以自由使用任何实现语言。",
    },
    defaultSpeed: 1,
    steps: [
      {
        stepId: "dfs-1",
        type: "graph",
        structure: "tree",
        nodes: [
          { id: "A", label: "A", state: "active" },
          { id: "B", label: "B", state: "frontier" },
          { id: "C", label: "C", state: "frontier" },
          { id: "D", label: "D" },
          { id: "E", label: "E" },
        ],
        edges: [
          { source: "A", target: "B", state: "candidate" },
          { source: "A", target: "C", state: "candidate" },
          { source: "B", target: "D" },
          { source: "C", target: "E" },
        ],
        focusIds: ["A"],
        message: {
          en: "Start at A and open both outgoing branches.",
          zh: "从 A 开始，打开两条向外分支。",
        },
      },
      {
        stepId: "dfs-2",
        type: "graph",
        structure: "tree",
        nodes: [
          { id: "A", label: "A", state: "visited" },
          { id: "B", label: "B", state: "active" },
          { id: "C", label: "C", state: "frontier" },
          { id: "D", label: "D", state: "frontier" },
          { id: "E", label: "E" },
        ],
        edges: [
          { source: "A", target: "B", state: "active" },
          { source: "A", target: "C", state: "candidate" },
          { source: "B", target: "D", state: "candidate" },
          { source: "C", target: "E" },
        ],
        focusIds: ["B"],
        message: {
          en: "Go deeper through B before exploring C.",
          zh: "先沿着 B 深入，再回头探索 C。",
        },
      },
      {
        stepId: "dfs-3",
        type: "graph",
        structure: "tree",
        nodes: [
          { id: "A", label: "A", state: "visited" },
          { id: "B", label: "B", state: "visited" },
          { id: "C", label: "C", state: "frontier" },
          { id: "D", label: "D", state: "active" },
          { id: "E", label: "E" },
        ],
        edges: [
          { source: "A", target: "B", state: "visited" },
          { source: "A", target: "C", state: "candidate" },
          { source: "B", target: "D", state: "active" },
          { source: "C", target: "E" },
        ],
        focusIds: ["D"],
        message: {
          en: "Visit D, the leaf at the end of the active branch.",
          zh: "访问 D，这是一条活跃分支末端的叶子节点。",
        },
      },
      {
        stepId: "dfs-4",
        type: "graph",
        structure: "tree",
        nodes: [
          { id: "A", label: "A", state: "visited" },
          { id: "B", label: "B", state: "done" },
          { id: "C", label: "C", state: "active" },
          { id: "D", label: "D", state: "done" },
          { id: "E", label: "E", state: "frontier" },
        ],
        edges: [
          { source: "A", target: "B", state: "visited" },
          { source: "A", target: "C", state: "active" },
          { source: "B", target: "D", state: "done" },
          { source: "C", target: "E", state: "candidate" },
        ],
        focusIds: ["C"],
        message: {
          en: "Backtrack to A, then continue with C.",
          zh: "回溯到 A，然后继续访问 C。",
        },
      },
      {
        stepId: "dfs-5",
        type: "graph",
        structure: "tree",
        nodes: [
          { id: "A", label: "A", state: "done" },
          { id: "B", label: "B", state: "done" },
          { id: "C", label: "C", state: "visited" },
          { id: "D", label: "D", state: "done" },
          { id: "E", label: "E", state: "active" },
        ],
        edges: [
          { source: "A", target: "B", state: "done" },
          { source: "A", target: "C", state: "visited" },
          { source: "B", target: "D", state: "done" },
          { source: "C", target: "E", state: "active" },
        ],
        focusIds: ["E"],
        message: {
          en: "Finish by visiting E on the last branch.",
          zh: "最后访问 E，完成最后一条分支。",
        },
      },
      {
        stepId: "dfs-6",
        type: "graph",
        structure: "tree",
        nodes: [
          { id: "A", label: "A", state: "done" },
          { id: "B", label: "B", state: "done" },
          { id: "C", label: "C", state: "done" },
          { id: "D", label: "D", state: "done" },
          { id: "E", label: "E", state: "done" },
        ],
        edges: [
          { source: "A", target: "B", state: "done" },
          { source: "A", target: "C", state: "done" },
          { source: "B", target: "D", state: "done" },
          { source: "C", target: "E", state: "done" },
        ],
        focusIds: ["A", "B", "C", "D", "E"],
        message: {
          en: "DFS is complete and every node is marked done.",
          zh: "DFS 完成，所有节点都被标记为完成。",
        },
      },
    ],
  }),
};

export const demoVisualizationDefinitions = [bubbleSortDefinition, dfsDefinition];

