/*
  Copyright 2021 Takeshi George Matsuda (https://github.com/take4mats)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import * as d3 from "d3";
import { Node, Edge, Graph, D3Graph, D3Edge, D3Node } from "@/types/graph";

const width = 1200;
const height = 800;
const circleRadius = 20; // circle circleRadius
const edgeDistance = 200;
const chargeStrength = -400;

function render(
  d3svg: any,
  zoom: any,
  simulation: any,
  nodes: any,
  edges: any,
  edgeLabels: any
) {
  // maintain the topology
  simulation.on("tick", () => {
    nodes
      .attr("cx", (d: any) => d.x)
      .attr("cy", (d: any) => d.y)
      .attr("transform", (d: any) => {
        return `translate(${d.x},${d.y})`;
      });

    edges
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    edgeLabels
      .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
      .attr("y", (d: any) => (d.source.y + d.target.y) / 2);
  });

  d3svg.call(zoom); // enable zoom
}

// color utility
const color = d3.scaleOrdinal(d3.schemeTableau10);

function generateGraphData(data: Graph): D3Graph {
  const nodes = data.nodes.map((node: Node, index: number) => {
    return {
      _id: String(index),
      name: node.name,
      group: node.group,
    };
  });

  const edges: D3Edge[] = data.edges.map((edge: Edge, index: number) => {
    const src = nodes.find((ele) => ele.name === edge.source) || {
      _id: "9999",
    };
    const tgt = nodes.find((ele) => ele.name === edge.target) || {
      _id: "9999",
    };
    return {
      _id: String(index),
      source: src._id,
      target: tgt._id,
      value: edge.value,
    };
  });

  return {
    nodes: nodes,
    edges: edges,
  };
}

// add node data&element
function defineNodes(d3g: any, d3nodes: D3Node[], drag: any, tooltip: any) {
  // define node g
  const n = d3g
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(d3nodes)
    .enter()
    .append("g")
    .attr("id", (d: D3Node) => `node-${d._id}`)
    .attr("class", () => "node");

  // define circle under node g
  n.append("circle")
    .attr("r", circleRadius)
    .attr("fill", (d: D3Node) => color(d.group));

  // define text under node g
  n.append("text")
    .attr("class", "node-label")
    .style("pointer-events", "none")
    .text((d: D3Node) => d.name);

  // enable drag
  n.call(drag);

  // enable click action
  n.on("click", (event: any, data: any) => highlight(event, data));

  // enable mouse-over/move/out action
  n.on("mouseover", (_e: any, data: any) => {
    tooltip.style("visibility", "visible").html(
      Object.keys(data)
        .map((key) => {
          if (!["index", "x", "y", "vx", "vy", "fx", "fy"].includes(key))
            return `<li>${key}: ${data[key]}</li>`;
        })
        .join("")
    );
  })
    .on("mousemove", (event: any) => {
      tooltip
        .style("top", event.pageY - 60 + "px")
        .style("left", event.pageX + 20 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  return n;
}

// add edge data&element
function defineEdges(d3g: any, d3edges: D3Edge[]) {
  const l = d3g
    .append("g")
    .attr("class", "edges")
    .selectAll("line")
    .data(d3edges)
    .enter()
    .append("g")
    .attr("id", (d: any) => {
      console.log(d);
      return `edge-${d.source._id}-${d.target._id}-`;
    })
    .attr("class", () => "edge")
    .append("line");

  return l;
}

function defineEdgeLabels(d3g: any) {
  const ll = d3g
    .selectAll(".edges > g")
    .append("text")
    .attr("class", "edge-label")
    .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
    .attr("y", (d: any) => (d.source.y + d.target.y) / 2)
    .text((d: any) => d.value);

  return ll;
}

// create a new force simulation graph
function defineSimulation(d3nodes: any, d3edges: any) {
  const sim = d3
    .forceSimulation(d3nodes)
    .force(
      "link",
      d3
        .forceLink(d3edges)
        .distance(() => edgeDistance)
        .id((d: any) => d._id)
    )
    .force("charge", d3.forceManyBody().strength(chargeStrength))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alphaMin(0.02);

  return sim;
}

// drag utility functions
function defineDrag(simulation: any) {
  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.9).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0).alphaMin(0.2);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

// zoom utility functions
function defineZoom(d3g: any) {
  return d3
    .zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", function (event) {
      d3g.attr("transform", event.transform);
    });
}

function highlight(_event: any, data: any) {
  // first, suppress all
  d3.selectAll("circle").classed("node-suppressed", true);
  d3.selectAll("text.node-label").classed("node-label-suppressed", true);
  d3.selectAll("line").classed("edge-suppressed", true);
  d3.selectAll("text.edge-label").classed("edge-label-suppressed", true);

  // next, highlight clicked node
  d3.select(`#node-${data._id}`)
    .select("circle")
    .classed("node-suppressed", false);
  d3.select(`#node-${data._id}`)
    .select("text")
    .classed("node-label-suppressed", false);

  d3.selectAll(".edge")
    .filter((v: any): any => {
      // then highlight connected nodes
      if (data._id == v.source._id) {
        const nodeId = `#node-${v.target._id}`;
        d3.select(nodeId).select("circle").classed("node-suppressed", false);
        d3.select(nodeId)
          .select("text")
          .classed("node-label-suppressed", false);
        return true;
      } else if (data._id == v.target._id) {
        const nodeId = `#node-${v.source._id}`;
        d3.select(nodeId).select("circle").classed("node-suppressed", false);
        d3.select(nodeId)
          .select("text")
          .classed("node-label-suppressed", false);
        return true;
      }
    })
    // finally highlight connected edges
    .each((d: any) => {
      const edgeId = `#edge-${d.source._id}-${d.target._id}-`;
      d3.select(edgeId).select("line").classed("edge-suppressed", false);
      d3.select(edgeId).select("text").classed("edge-label-suppressed", false);
    });
}

function clearHighlight(event: any, _data: any) {
  if (
    Object.prototype.toString.call(event.path[0]) === "[object SVGSVGElement]"
  ) {
    // cancel all the suppression
    d3.selectAll("circle").classed("node-suppressed", () => false);
    d3.selectAll("text.node-label").classed("node-label-suppressed", false);
    d3.selectAll("line").classed("edge-suppressed", () => false);
    d3.selectAll("text.edge-label").classed("edge-label-suppressed", false);
  }
}

// ----
// main
// ----
export const d3HumanNetwork = function (data: Graph): void {
  // add unique _id to each element
  const graphData = generateGraphData(data);
  console.log(data);
  console.log(graphData);

  // ramove current graph
  d3.select("#graph > svg").remove();

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .on("click", (e, d) => clearHighlight(e, d));
  const g = svg.append("g").attr("cursor", "grab");
  const simulation = defineSimulation(graphData.nodes, graphData.edges);
  const drag = defineDrag(simulation);
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden")
    .style("z-index", 1000);
  const zoom = defineZoom(g);

  // render edges first to keep them behind nodes
  const edges = defineEdges(g, graphData.edges);
  const edgeLabels = defineEdgeLabels(g);
  const nodes = defineNodes(g, graphData.nodes, drag, tooltip);

  render(svg, zoom, simulation, nodes, edges, edgeLabels);
};
