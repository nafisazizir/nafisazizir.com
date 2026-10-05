import type { PatternProps } from "./frame"
import { PatternSteps } from "./steps"
import { PatternWedge } from "./wedge"
import { PatternWedgeMirror } from "./wedge-mirror"
import { PatternCornerNotch } from "./corner-notch"
import { PatternSpread } from "./spread"
import { PatternCorridor } from "./corridor"
import { PatternPrism } from "./prism"
import { PatternFanIn } from "./fan-in"
import { PatternAngle } from "./angle"
import { PatternNotch } from "./notch"
import { PatternSlots } from "./slots"
import { PatternColumns } from "./columns"
import { PatternBowl } from "./bowl"
import { PatternQuadrant } from "./quadrant"
import { PatternOffset } from "./offset"
import { PatternStair } from "./stair"
import { PatternCross } from "./cross"
import { PatternTaper } from "./taper"
import { PatternElbow } from "./elbow"
import { PatternLens } from "./lens"
import { PatternEclipse } from "./eclipse"
import { PatternTangent } from "./tangent"
import { PatternArch } from "./arch"
import { PatternGolden } from "./golden"
import { PatternCone } from "./cone"
import { PatternCradle } from "./cradle"
import { PatternHorizon } from "./horizon"
import { PatternContact } from "./contact"
import { PatternBelt } from "./belt"
import { PatternField } from "./field"
import { PatternHalftone } from "./halftone"
import { PatternGrid } from "./grid"
import { PatternRuler } from "./ruler"
import { PatternHatch } from "./hatch"
import { PatternLatency } from "./latency"
import { PatternHistogram } from "./histogram"
import { PatternTrace } from "./trace"
import { PatternBars } from "./bars"
import { PatternDonut } from "./donut"
import { PatternDatabase } from "./database"
import { PatternStack } from "./stack"
import { PatternLinkedList } from "./linked-list"
import { PatternQueue } from "./queue"
import { PatternHash } from "./hash"
import { PatternLog } from "./log"
import { PatternBTree } from "./b-tree"
import { PatternRing } from "./ring"
import { PatternReplica } from "./replica"
import { PatternStream } from "./stream"
import { PatternWorkflow } from "./workflow"
import { PatternDag } from "./dag"
import { PatternDurable } from "./durable"
import { PatternTrigger } from "./trigger"
import { PatternWebhook } from "./webhook"
import { PatternBackoff } from "./backoff"
import { PatternBus } from "./bus"
import { PatternBranch } from "./branch"
import { PatternCycle } from "./cycle"
import { PatternCircuit } from "./circuit"
import { PatternWaveform } from "./waveform"
import { PatternGraph } from "./graph"
import { PatternTree } from "./tree"
import { PatternBinaryTree } from "./binary-tree"
import { PatternPersistent } from "./persistent"
import { PatternBipartite } from "./bipartite"
import { PatternHub } from "./hub"
import { PatternNeuralNet } from "./neural-net"
import { PatternLatent } from "./latent"
import { PatternBottleneck } from "./bottleneck"
import { PatternNetwork } from "./network"
import { PatternAttention } from "./attention"
import { PatternMask } from "./mask"
import { PatternEmbedding } from "./embedding"
import { PatternDiffusion } from "./diffusion"

export const families = [
  {
    name: "Lines",
    description: "Lines meeting at points: wedges, fans, rays, perspective.",
  },
  {
    name: "Bands",
    description:
      "Cut-out bands that run off an edge, and the guides around them.",
  },
  { name: "Curves", description: "Arcs, circles and waves." },
  { name: "Grids", description: "Rhythm: grains, ticks, bars and rows." },
  {
    name: "Charts",
    description:
      "Data drawn as data: distributions, latencies, traces, shares.",
  },
  {
    name: "Data",
    description:
      "Where data lives and how it is laid out: stores, lists, logs, indexes.",
  },
  {
    name: "Flows",
    description:
      "Work moving through a system: workflows, triggers, retries, events.",
  },
  {
    name: "Graphs",
    description: "Nodes and edges: graphs, trees, shared structure.",
  },
  {
    name: "Models",
    description:
      "Structures from machine learning: layers, attention, search, noise.",
  },
] as const

export type PatternFamily = (typeof families)[number]["name"]

export type PatternEntry = {
  name: string
  label: string
  family: PatternFamily
  Component: (props: PatternProps) => React.ReactNode
}

// Grouped by family, in the order the catalogue shows them.
export const patterns: PatternEntry[] = [
  {
    name: "PatternSteps",
    label: "Steps",
    family: "Lines",
    Component: PatternSteps,
  },
  {
    name: "PatternWedge",
    label: "Wedge",
    family: "Lines",
    Component: PatternWedge,
  },
  {
    name: "PatternWedgeMirror",
    label: "Wedge mirror",
    family: "Lines",
    Component: PatternWedgeMirror,
  },
  {
    name: "PatternCornerNotch",
    label: "Corner notch",
    family: "Lines",
    Component: PatternCornerNotch,
  },
  {
    name: "PatternSpread",
    label: "Spread",
    family: "Lines",
    Component: PatternSpread,
  },
  {
    name: "PatternCorridor",
    label: "Corridor",
    family: "Lines",
    Component: PatternCorridor,
  },
  {
    name: "PatternPrism",
    label: "Prism",
    family: "Lines",
    Component: PatternPrism,
  },
  {
    name: "PatternFanIn",
    label: "Fan-in",
    family: "Lines",
    Component: PatternFanIn,
  },
  {
    name: "PatternAngle",
    label: "Angle",
    family: "Lines",
    Component: PatternAngle,
  },
  {
    name: "PatternNotch",
    label: "Notch",
    family: "Bands",
    Component: PatternNotch,
  },
  {
    name: "PatternSlots",
    label: "Slots",
    family: "Bands",
    Component: PatternSlots,
  },
  {
    name: "PatternColumns",
    label: "Columns",
    family: "Bands",
    Component: PatternColumns,
  },
  {
    name: "PatternBowl",
    label: "Bowl",
    family: "Bands",
    Component: PatternBowl,
  },
  {
    name: "PatternQuadrant",
    label: "Quadrant",
    family: "Bands",
    Component: PatternQuadrant,
  },
  {
    name: "PatternOffset",
    label: "Offset",
    family: "Bands",
    Component: PatternOffset,
  },
  {
    name: "PatternStair",
    label: "Stair",
    family: "Bands",
    Component: PatternStair,
  },
  {
    name: "PatternCross",
    label: "Cross",
    family: "Bands",
    Component: PatternCross,
  },
  {
    name: "PatternTaper",
    label: "Taper",
    family: "Bands",
    Component: PatternTaper,
  },
  {
    name: "PatternElbow",
    label: "Elbow",
    family: "Bands",
    Component: PatternElbow,
  },
  {
    name: "PatternLens",
    label: "Lens",
    family: "Curves",
    Component: PatternLens,
  },
  {
    name: "PatternEclipse",
    label: "Eclipse",
    family: "Curves",
    Component: PatternEclipse,
  },
  {
    name: "PatternTangent",
    label: "Tangent",
    family: "Curves",
    Component: PatternTangent,
  },
  {
    name: "PatternArch",
    label: "Arch",
    family: "Curves",
    Component: PatternArch,
  },
  {
    name: "PatternGolden",
    label: "Golden",
    family: "Curves",
    Component: PatternGolden,
  },
  {
    name: "PatternCone",
    label: "Cone",
    family: "Curves",
    Component: PatternCone,
  },
  {
    name: "PatternCradle",
    label: "Cradle",
    family: "Curves",
    Component: PatternCradle,
  },
  {
    name: "PatternHorizon",
    label: "Horizon",
    family: "Curves",
    Component: PatternHorizon,
  },
  {
    name: "PatternContact",
    label: "Contact",
    family: "Curves",
    Component: PatternContact,
  },
  {
    name: "PatternBelt",
    label: "Belt",
    family: "Curves",
    Component: PatternBelt,
  },
  {
    name: "PatternField",
    label: "Field",
    family: "Grids",
    Component: PatternField,
  },
  {
    name: "PatternHalftone",
    label: "Halftone",
    family: "Grids",
    Component: PatternHalftone,
  },
  {
    name: "PatternGrid",
    label: "Grid",
    family: "Grids",
    Component: PatternGrid,
  },
  {
    name: "PatternRuler",
    label: "Ruler",
    family: "Grids",
    Component: PatternRuler,
  },
  {
    name: "PatternHatch",
    label: "Hatch",
    family: "Grids",
    Component: PatternHatch,
  },
  {
    name: "PatternLatency",
    label: "Latency",
    family: "Charts",
    Component: PatternLatency,
  },
  {
    name: "PatternHistogram",
    label: "Histogram",
    family: "Charts",
    Component: PatternHistogram,
  },
  {
    name: "PatternTrace",
    label: "Trace",
    family: "Charts",
    Component: PatternTrace,
  },
  {
    name: "PatternBars",
    label: "Bars",
    family: "Charts",
    Component: PatternBars,
  },
  {
    name: "PatternDonut",
    label: "Donut",
    family: "Charts",
    Component: PatternDonut,
  },
  {
    name: "PatternDatabase",
    label: "Database",
    family: "Data",
    Component: PatternDatabase,
  },
  {
    name: "PatternStack",
    label: "Stack",
    family: "Data",
    Component: PatternStack,
  },
  {
    name: "PatternLinkedList",
    label: "Linked list",
    family: "Data",
    Component: PatternLinkedList,
  },
  {
    name: "PatternQueue",
    label: "Queue",
    family: "Data",
    Component: PatternQueue,
  },
  {
    name: "PatternHash",
    label: "Hash",
    family: "Data",
    Component: PatternHash,
  },
  { name: "PatternLog", label: "Log", family: "Data", Component: PatternLog },
  {
    name: "PatternBTree",
    label: "B-tree",
    family: "Data",
    Component: PatternBTree,
  },
  {
    name: "PatternRing",
    label: "Ring",
    family: "Data",
    Component: PatternRing,
  },
  {
    name: "PatternReplica",
    label: "Replica",
    family: "Data",
    Component: PatternReplica,
  },
  {
    name: "PatternStream",
    label: "Stream",
    family: "Data",
    Component: PatternStream,
  },
  {
    name: "PatternWorkflow",
    label: "Workflow",
    family: "Flows",
    Component: PatternWorkflow,
  },
  { name: "PatternDag", label: "DAG", family: "Flows", Component: PatternDag },
  {
    name: "PatternDurable",
    label: "Durable",
    family: "Flows",
    Component: PatternDurable,
  },
  {
    name: "PatternTrigger",
    label: "Trigger",
    family: "Flows",
    Component: PatternTrigger,
  },
  {
    name: "PatternWebhook",
    label: "Webhook",
    family: "Flows",
    Component: PatternWebhook,
  },
  {
    name: "PatternBackoff",
    label: "Backoff",
    family: "Flows",
    Component: PatternBackoff,
  },
  { name: "PatternBus", label: "Bus", family: "Flows", Component: PatternBus },
  {
    name: "PatternBranch",
    label: "Branch",
    family: "Flows",
    Component: PatternBranch,
  },
  {
    name: "PatternCycle",
    label: "Cycle",
    family: "Flows",
    Component: PatternCycle,
  },
  {
    name: "PatternCircuit",
    label: "Circuit",
    family: "Flows",
    Component: PatternCircuit,
  },
  {
    name: "PatternWaveform",
    label: "Waveform",
    family: "Flows",
    Component: PatternWaveform,
  },
  {
    name: "PatternGraph",
    label: "Graph",
    family: "Graphs",
    Component: PatternGraph,
  },
  {
    name: "PatternTree",
    label: "Tree",
    family: "Graphs",
    Component: PatternTree,
  },
  {
    name: "PatternBinaryTree",
    label: "Binary tree",
    family: "Graphs",
    Component: PatternBinaryTree,
  },
  {
    name: "PatternPersistent",
    label: "Persistent",
    family: "Graphs",
    Component: PatternPersistent,
  },
  {
    name: "PatternBipartite",
    label: "Bipartite",
    family: "Graphs",
    Component: PatternBipartite,
  },
  { name: "PatternHub", label: "Hub", family: "Graphs", Component: PatternHub },
  {
    name: "PatternNeuralNet",
    label: "Neural net",
    family: "Models",
    Component: PatternNeuralNet,
  },
  {
    name: "PatternLatent",
    label: "Latent",
    family: "Models",
    Component: PatternLatent,
  },
  {
    name: "PatternBottleneck",
    label: "Bottleneck",
    family: "Models",
    Component: PatternBottleneck,
  },
  {
    name: "PatternNetwork",
    label: "Network",
    family: "Models",
    Component: PatternNetwork,
  },
  {
    name: "PatternAttention",
    label: "Attention",
    family: "Models",
    Component: PatternAttention,
  },
  {
    name: "PatternMask",
    label: "Mask",
    family: "Models",
    Component: PatternMask,
  },
  {
    name: "PatternEmbedding",
    label: "Embedding",
    family: "Models",
    Component: PatternEmbedding,
  },
  {
    name: "PatternDiffusion",
    label: "Diffusion",
    family: "Models",
    Component: PatternDiffusion,
  },
]

export {
  PatternSteps,
  PatternWedge,
  PatternWedgeMirror,
  PatternCornerNotch,
  PatternSpread,
  PatternCorridor,
  PatternPrism,
  PatternFanIn,
  PatternAngle,
  PatternNotch,
  PatternSlots,
  PatternColumns,
  PatternBowl,
  PatternQuadrant,
  PatternOffset,
  PatternStair,
  PatternCross,
  PatternTaper,
  PatternElbow,
  PatternLens,
  PatternEclipse,
  PatternTangent,
  PatternArch,
  PatternGolden,
  PatternCone,
  PatternCradle,
  PatternHorizon,
  PatternContact,
  PatternBelt,
  PatternField,
  PatternHalftone,
  PatternGrid,
  PatternRuler,
  PatternHatch,
  PatternLatency,
  PatternHistogram,
  PatternTrace,
  PatternBars,
  PatternDonut,
  PatternDatabase,
  PatternStack,
  PatternLinkedList,
  PatternQueue,
  PatternHash,
  PatternLog,
  PatternBTree,
  PatternRing,
  PatternReplica,
  PatternStream,
  PatternWorkflow,
  PatternDag,
  PatternDurable,
  PatternTrigger,
  PatternWebhook,
  PatternBackoff,
  PatternBus,
  PatternBranch,
  PatternCycle,
  PatternCircuit,
  PatternWaveform,
  PatternGraph,
  PatternTree,
  PatternBinaryTree,
  PatternPersistent,
  PatternBipartite,
  PatternHub,
  PatternNeuralNet,
  PatternLatent,
  PatternBottleneck,
  PatternNetwork,
  PatternAttention,
  PatternMask,
  PatternEmbedding,
  PatternDiffusion,
}
export { PatternFrame, type PatternProps } from "./frame"
export { PatternStage } from "./stage"
