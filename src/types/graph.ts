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
  x: number;
  y: number;
  i: string;
  name: string;
  group: string;
}

type D3Position = {
  x: number;
  y: number;
};

interface D3Edge {
  i: string;
  source: D3Position;
  target: D3Position;
  value: string;
}

interface D3Graph {
  nodes: D3Node[];
  edges: D3Edge[];
}

interface D3Label {
  source: D3Position;
  target: D3Position;
}

export { Node, Edge, Graph, Member, D3Node, D3Edge, D3Label, D3Graph };
