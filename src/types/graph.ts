interface Node {
  id: string;
  group: string;
}

interface Edge {
  source: string;
  target: string;
  value: string;
}

interface Graph {
  nodes: Node[];
  edges: Edge[];
}

type Member = string;

export { Node, Edge, Graph, Member };
