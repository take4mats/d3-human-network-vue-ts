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

const theta = Math.PI * (3 - Math.sqrt(5));
const width = 800;
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

// add node data&element
function defineNodes(d3g: any, nodes: any, drag: any) {
  // define node g
  const n = d3g
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("g")
    .attr("id", (d: any) => `node-${d.id}`)
    .attr("class", () => "node");

  // define circle under node g
  n.append("circle")
    .attr("r", circleRadius)
    .attr("fill", (d: any) => color(d.group));

  // define text under node g
  n.append("text")
    .attr("class", "node-label")
    .style("pointer-events", "none")
    .text((d: any) => d.id);

  // enable drag
  n.call(drag);

  // enable click action
  n.on("click", (event: any, data: any) => highlight(event, data));

  return n;
}

// add edge data&element
function defineLinks(d3g: any, edges: any) {
  const l = d3g
    .append("g")
    .attr("class", "edges")
    .selectAll("line")
    .data(edges)
    .enter()
    .append("g")
    .attr("id", (d: any) => `edge-${d.source.id}-${d.target.id}-`)
    .attr("class", () => "edge")
    .append("line");

  return l;
}

function defineLinkLabels(d3g: any) {
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
function defineSimulation(nodes: any, edges: any) {
  const sim = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(edges)
        .distance(() => edgeDistance)
        .id((d: any) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(chargeStrength))
    .force("center", d3.forceCenter(width / 2, height / 2));

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
    if (!event.active) simulation.alphaTarget(0);
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
    .on("zoom", function (event: any) {
      d3g.attr("transform", event.transform);
    });
}

function highlight(_event: any, data: any) {
  // first, suppress all
  d3.selectAll("circle").classed("node-suppressed", () => true);
  d3.selectAll("text.node-label").classed("node-label-suppressed", () => true);
  d3.selectAll("line").classed("edge-suppressed", () => true);
  d3.selectAll("text.edge-label").classed("edge-label-suppressed", () => true);

  // next, highlight clicked node
  d3.select(`#node-${data.id}`)
    .select("circle")
    .classed("node-suppressed", false);
  d3.select(`#node-${data.id}`)
    .select("text")
    .classed("node-label-suppressed", false);

  d3.selectAll(".edge")
    .filter((v: any): any => {
      // then highlight connected nodes
      if (data.id == v.source.id) {
        const nodeId = `#node-${v.target.id}`;
        d3.select(nodeId).select("circle").classed("node-suppressed", false);
        d3.select(nodeId)
          .select("text")
          .classed("node-label-suppressed", false);
        return true;
      } else if (data.id == v.target.id) {
        const nodeId = `#node-${v.source.id}`;
        d3.select(nodeId).select("circle").classed("node-suppressed", false);
        d3.select(nodeId)
          .select("text")
          .classed("node-label-suppressed", false);
        return true;
      }
    })
    // finally highlight connected edges
    .each((d: any) => {
      const edgeId = `#edge-${d.source.id}-${d.target.id}-`;
      d3.select(edgeId).select("line").classed("edge-suppressed", false);
      d3.select(edgeId).select("text").classed("edge-label-suppressed", false);
    });
}

// ----
// main
// ----
export const d3Render = function (data: any): void {
  d3.select("#graph > svg").remove();

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", `0 0 ${width} ${height}`);
  // .attr("viewBox", [0, 0, width, height]);
  const g = svg.append("g").attr("cursor", "grab");

  const simulation = defineSimulation(data.nodes, data.edges);
  const drag = defineDrag(simulation);
  const zoom = defineZoom(g);
  const edges = defineLinks(g, data.edges);
  const edgeLabels = defineLinkLabels(g);
  const nodes = defineNodes(g, data.nodes, drag);
  render(svg, zoom, simulation, nodes, edges, edgeLabels);
};
