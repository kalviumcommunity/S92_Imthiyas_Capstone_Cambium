import SectionWrapper from "../components/SectionWrapper";

const NODE_STYLES: Record<string, { fill: string; stroke: string; textColor: string; label: string }> = {
  researcher: { fill: "#173F35", stroke: "#173F35", textColor: "#F7F6F1", label: "Researcher" },
  paper: { fill: "#FFFFFF", stroke: "#173F35", textColor: "#17201D", label: "Paper" },
  project: { fill: "#FFFFFF", stroke: "#1E5A72", textColor: "#17201D", label: "Project" },
  topic: { fill: "#EFF5F2", stroke: "#7EB5A0", textColor: "#0D2B22", label: "Topic" },
  opportunity: { fill: "#FFFFFF", stroke: "#856214", textColor: "#17201D", label: "Opportunity" },
  dataset: { fill: "#EEECE6", stroke: "#9CAAA5", textColor: "#66716C", label: "Dataset" },
  publication: { fill: "#EFF5F2", stroke: "#285C4D", textColor: "#0D2B22", label: "Publication" },
};

interface Node { id: string; type: keyof typeof NODE_STYLES; x: number; y: number; label: string; }
interface Edge { from: string; to: string; label?: string; }
interface DiagramProps { nodes: Node[]; edges: Edge[]; title: string; width?: number; height?: number; }

function NodeShape({ node }: { node: Node }) {
  const style = NODE_STYLES[node.type];
  const w = 96, h = 28;
  return (
    <g>
      <rect x={node.x - w/2} y={node.y - h/2} width={w} height={h} rx={5} fill={style.fill} stroke={style.stroke} strokeWidth="1.5" />
      <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontFamily="Manrope, system-ui, sans-serif" fontWeight="500" fill={style.textColor}>
        {node.label}
      </text>
    </g>
  );
}

function Diagram({ nodes, edges, title, width = 420, height = 100 }: DiagramProps) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge-default bg-surface-sunken">
        <span className="text-[11px] font-medium text-ink-secondary">{title}</span>
      </div>
      <div className="p-4 flex items-center justify-center">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {edges.map((edge, i) => {
            const from = nodeMap[edge.from], to = nodeMap[edge.to];
            if (!from || !to) return null;
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#B8C4C0" strokeWidth="1" />
                {edge.label && (
                  <text x={(from.x+to.x)/2} y={(from.y+to.y)/2 - 5} textAnchor="middle" fontSize="9" fontFamily="Manrope" fill="#9CAAA5">
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
          {nodes.map((node) => <NodeShape key={node.id} node={node} />)}
        </svg>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl p-5">
      <h4 className="text-[11px] font-semibold tracking-[0.12em] text-ink-tertiary uppercase mb-4">Node Legend</h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(NODE_STYLES).map(([type, style]) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: style.fill, border: `1.5px solid ${style.stroke}` }} />
            <span className="text-[11px] text-ink-secondary capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DIAGRAMS: DiagramProps[] = [
  {
    title: "Paper → Topic",
    width: 380, height: 100,
    nodes: [
      { id: "paper", type: "paper", x: 130, y: 50, label: "Neural Plasticity" },
      { id: "t1", type: "topic", x: 280, y: 28, label: "Neuroscience" },
      { id: "t2", type: "topic", x: 280, y: 72, label: "Learning" },
    ],
    edges: [{ from: "paper", to: "t1", label: "tagged" }, { from: "paper", to: "t2", label: "tagged" }],
  },
  {
    title: "Researcher → Paper",
    width: 380, height: 100,
    nodes: [
      { id: "r", type: "researcher", x: 100, y: 50, label: "J. Lee, PhD" },
      { id: "p1", type: "paper", x: 260, y: 28, label: "Study A (2024)" },
      { id: "p2", type: "paper", x: 260, y: 72, label: "Study B (2023)" },
    ],
    edges: [{ from: "r", to: "p1", label: "authored" }, { from: "r", to: "p2", label: "authored" }],
  },
  {
    title: "Researcher → Project",
    width: 380, height: 100,
    nodes: [
      { id: "r", type: "researcher", x: 100, y: 50, label: "A. Rahman" },
      { id: "proj", type: "project", x: 270, y: 50, label: "IMPACT Study" },
    ],
    edges: [{ from: "r", to: "proj", label: "leads" }],
  },
  {
    title: "Project → Dataset",
    width: 380, height: 100,
    nodes: [
      { id: "proj", type: "project", x: 120, y: 50, label: "IMPACT Study" },
      { id: "ds", type: "dataset", x: 280, y: 50, label: "Dataset v2.1" },
    ],
    edges: [{ from: "proj", to: "ds", label: "produces" }],
  },
  {
    title: "Paper → Citation",
    width: 380, height: 100,
    nodes: [
      { id: "p1", type: "paper", x: 100, y: 50, label: "Source Paper" },
      { id: "p2", type: "publication", x: 280, y: 28, label: "Cited Work A" },
      { id: "p3", type: "publication", x: 280, y: 72, label: "Cited Work B" },
    ],
    edges: [{ from: "p1", to: "p2", label: "cites" }, { from: "p1", to: "p3", label: "cites" }],
  },
  {
    title: "Researcher ↔ Researcher",
    width: 380, height: 100,
    nodes: [
      { id: "r1", type: "researcher", x: 100, y: 50, label: "M. Williams" },
      { id: "r2", type: "researcher", x: 280, y: 50, label: "K. Patel" },
    ],
    edges: [{ from: "r1", to: "r2", label: "collaborates" }],
  },
];

export default function ResearchVizSection() {
  return (
    <SectionWrapper
      id="research-viz"
      num="10"
      title="Research Visualization"
      description="Visual language for connected research objects. Nodes typed with the brand palette — forest green for researchers, white with green border for papers, tinted fills for topics."
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        {DIAGRAMS.map((d) => <Diagram key={d.title} {...d} />)}
      </div>
      <Legend />
    </SectionWrapper>
  );
}
