interface Node {
  name: string;
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

interface D3Node {
  _id: string;
  name: string;
  group: string;
}

interface D3Edge {
  _id: string;
  source: string;
  target: string;
  value: string;
}

interface D3Graph {
  nodes: D3Node[];
  edges: D3Edge[];
}

export { Node, Edge, Graph, Member, D3Node, D3Edge, D3Graph };
