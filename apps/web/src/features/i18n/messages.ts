import type { LocalizedText } from "@node-canvas/visualization-contract";

export type UIMessageKey =
  | "brand"
  | "tagline"
  | "browse"
  | "open"
  | "optionsPanel"
  | "codePanel"
  | "stagePanel"
  | "searchPlaceholder"
  | "metadata"
  | "structurePlaceholder"
  | "stepSnapshot"
  | "readmeTab"
  | "sourceTab"
  | "dataTab"
  | "workspaceHint"
  | "visualizationId"
  | "schema"
  | "theme"
  | "lightMode"
  | "darkMode"
  | "algorithmsSection"
  | "dataStructuresSection"
  | "emptyCollection"
  | "playground"
  | "steps"
  | "speed"
  | "reset"
  | "previous"
  | "next"
  | "play"
  | "pause"
  | "summary"
  | "message"
  | "currentScene"
  | "loading"
  | "invalidPayload"
  | "notFound"
  | "backHome"
  | "usingMockData"
  | "supportedScenes"
  | "mediumScaleNote"
  | "locale"
  | "arrayScene"
  | "graphScene"
  | "errorTitle"
  | "emptyState";

export const uiMessages: Record<UIMessageKey, LocalizedText> = {
  brand: {
    en: "Visualization Player",
    zh: "可视化播放器",
  },
  tagline: {
    en: "A fixed frontend for algorithm stories, regardless of whether the backend is C++ or Java.",
    zh: "一个固定的算法可视化前端，无论后端是 C++ 还是 Java。",
  },
  browse: {
    en: "Browse visualizations",
    zh: "浏览可视化内容",
  },
  open: {
    en: "Open visualization",
    zh: "打开可视化",
  },
  optionsPanel: {
    en: "Options",
    zh: "选项",
  },
  codePanel: {
    en: "Code",
    zh: "代码",
  },
  stagePanel: {
    en: "Visualization",
    zh: "可视化",
  },
  searchPlaceholder: {
    en: "Search or filter",
    zh: "搜索或筛选",
  },
  metadata: {
    en: "Metadata",
    zh: "元信息",
  },
  structurePlaceholder: {
    en: "Layout placeholder. Replace these groups and controls with your own content later.",
    zh: "这里是布局占位区，后面可以替换成你自己的分组和控件。",
  },
  stepSnapshot: {
    en: "Step snapshot",
    zh: "步骤快照",
  },
  readmeTab: {
    en: "README.md",
    zh: "README.md",
  },
  sourceTab: {
    en: "code.ts",
    zh: "code.ts",
  },
  dataTab: {
    en: "step.json",
    zh: "step.json",
  },
  workspaceHint: {
    en: "The shell is fixed. You can replace the left and right content without touching the visualization core.",
    zh: "这个工作台骨架已经固定，后续替换左右内容时不需要改可视化核心。",
  },
  visualizationId: {
    en: "Visualization ID",
    zh: "可视化 ID",
  },
  schema: {
    en: "Schema",
    zh: "协议版本",
  },
  theme: {
    en: "Theme",
    zh: "主题",
  },
  lightMode: {
    en: "Day",
    zh: "白天",
  },
  darkMode: {
    en: "Night",
    zh: "黑夜",
  },
  algorithmsSection: {
    en: "Algorithms",
    zh: "算法",
  },
  dataStructuresSection: {
    en: "Data Structures",
    zh: "数据结构",
  },
  emptyCollection: {
    en: "Nothing here yet.",
    zh: "这里暂时还没有内容。",
  },
  playground: {
    en: "Player",
    zh: "播放器",
  },
  steps: {
    en: "Steps",
    zh: "步骤",
  },
  speed: {
    en: "Speed",
    zh: "速度",
  },
  reset: {
    en: "Reset",
    zh: "重置",
  },
  previous: {
    en: "Previous",
    zh: "上一步",
  },
  next: {
    en: "Next",
    zh: "下一步",
  },
  play: {
    en: "Play",
    zh: "播放",
  },
  pause: {
    en: "Pause",
    zh: "暂停",
  },
  summary: {
    en: "Summary",
    zh: "摘要",
  },
  message: {
    en: "Step message",
    zh: "步骤说明",
  },
  currentScene: {
    en: "Current scene",
    zh: "当前场景",
  },
  loading: {
    en: "Loading visualization...",
    zh: "正在加载可视化...",
  },
  invalidPayload: {
    en: "The visualization payload is invalid.",
    zh: "可视化数据协议无效。",
  },
  notFound: {
    en: "We could not find that visualization.",
    zh: "未找到该可视化。",
  },
  backHome: {
    en: "Back to home",
    zh: "返回首页",
  },
  usingMockData: {
    en: "V1 ships with two built-in demos and a repository seam for future HTTP data.",
    zh: "V1 内置两个 demo，并预留了未来接入 HTTP 数据的 repository 接口。",
  },
  supportedScenes: {
    en: "Supported scenes",
    zh: "支持的场景",
  },
  mediumScaleNote: {
    en: "V1 is intentionally tuned for teaching demos and medium-small inputs.",
    zh: "V1 有意针对教学 demo 和中小规模输入做优化。",
  },
  locale: {
    en: "Language",
    zh: "语言",
  },
  arrayScene: {
    en: "Array Scene",
    zh: "数组场景",
  },
  graphScene: {
    en: "Node-Edge Scene",
    zh: "节点边场景",
  },
  errorTitle: {
    en: "Something went wrong",
    zh: "出现了一些问题",
  },
  emptyState: {
    en: "No visualizations are available yet.",
    zh: "暂时还没有可视化内容。",
  },
};
