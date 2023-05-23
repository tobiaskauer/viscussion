
<script setup>

import embed from 'vega-embed';
import {onMounted} from 'vue'
import * as d3 from 'd3'
import { useVisualizationStore } from '../stores/visualization.js'
const visualizationStore = useVisualizationStore()
const spec = visualizationStore.getSpec
const annotations =  [
    {
        "id": 1,
        "target": {
            "type": "data",
            "id": 6558
        },
        "anchor": {"shape": "mark", "segment": {"scale": "x", "values": ["2005","2008"]}},
        "content": {
            "text": "I duplicate the mark \n of a single point"

        },
        "meta": {
            "category": "observation"
        }
    }
]

onMounted( () => {
    const result = embed('#vis', spec, {
      renderer: "svg",
    });
    result.then(result => {
      annotate({
        spec: spec,
          view: result.view,
          annotations: annotations,
          categories: ["uncategorized", "observation", "question"],
          desaturate: true,
    })

    result.view.addEventListener("mouseover", function (event, item) {
          console.log(item);
        });
    }

    
    )
})

const annotate = (config) => {
      
      const parsedJson = parse(annotations); //parse json, restructure data, find annotation target values
    let network = buildNetwork(parsedJson); //build nodes (anchors, content) and links from annotations
    let svg = createSVG(network);

    let scales = {};
    
    Object.keys(config.view._runtime.scales).forEach((key) => {
      scales[key] = config.view.scale(key);
    });

    updateAnnotations(svg, network, scales); //check visibility and position


  function getMark(node) {
    let type = node.json.target.type;
    let shape = node.json.anchor.shape;
    switch (true) {
      case type == "data" && shape == "mark":
        console.log(node)
        let bounds = node.target[0].bounds;
        
        node.target[0]._svg.__values__.center = {
          x: bounds.x1 + (bounds.x2 - bounds.x1) / 2,
          y: bounds.y1 + (bounds.y2 - bounds.y1) / 2,
        };

        return node.target[0]._svg.__values__;
        break;
      case type == "data" && shape == "circle":
        return circleMark(node);
        break;
      case type == "data" && shape == "rect":
        return rectMark(node);
        break;
      case type == "axis" && shape == "rect":
        return axisAnchor(node);
        break;
      default:
        console.log("could not create mark for node:", node);
    }

    function axisAnchor(node) {
      let bounds = node.target.bounds;
      return {
        x: 0,
        y: 0,
        center: {
          x: bounds.x1 + (bounds.x2 - bounds.x1) / 2,
          y: bounds.y1 + (bounds.y2 - bounds.y1) / 2,
        },
        d: `M ${bounds.x1} ${bounds.y1} L ${bounds.x2} ${bounds.y1} L ${bounds.x2} ${bounds.y2} L ${bounds.x1} ${bounds.y2} z`,
      };
    }

    function circleMark(node) {
      let numberOfTargets = node.target.length;
      if (numberOfTargets > 1) {
        //calculate median

        let extentX = d3.extent(node.target, (target) => target.x);
        let extentY = d3.extent(node.target, (target) => target.y);

        let deltaX = extentX[1] - extentX[0];
        let deltaY = extentY[1] - extentY[0];
        let delta = d3.max([deltaX, deltaY]);

        let maxSize = d3.max(node.target, (target) => target.size);
        let maxRadius = Math.sqrt(maxSize / Math.PI);

        let radius = (delta / 2 + maxRadius) * 1.1;

        let x = extentX[0] + (extentX[1] - extentX[0]) / 2;
        let y = extentY[0] + (extentY[1] - extentY[0]) / 2;

        return {
          d: `
  M ${0 - radius}, 0
  a ${radius}, ${radius} 0 1, 0 ${radius * 2}, 0
  a ${radius}, ${radius} 0 1, 0 ${-radius * 2}, 0
  `,
          transform: `translate(${x},${y})`,
          center: { x: x, y: y },
        };
      } else {
        return node.target[0]._svg.__values__; //TODO: this should be a circle (even if the original mark is not a circle)
      }
    }

    function rectMark(node) {
      let numberOfTargets = node.target.length;
      if (numberOfTargets > 1) {
        let extentX = d3.extent(node.target, (target) => target.x);
        let extentY = d3.extent(node.target, (target) => target.y);

        let coords = {
          x1: extentX[0] - 10,
          y1: extentY[0] - 10,
          x2: extentX[1] + 10,
          y2: extentY[1] + 10,
        };

        let x = extentX[0] + (extentX[1] - extentX[0]) / 2;
        let y = extentY[0] + (extentY[1] - extentY[0]) / 2;

        let d = `M ${coords.x1} ${coords.y1} L ${coords.x2} ${coords.y1} L ${coords.x2} ${coords.y2} L ${coords.x1} ${coords.y2} z`;

        return {
          d: d,
          //transform: `translate(${x},${y})`,
          center: { x: x, y: y },
        };
      } else {
        return node.target[0]._svg.__values__; //TODO: this should be a circle (even if the original mark is not a circle)
      }
    }
  }

  function getSegment(node, scales) {
    if (!node.json.anchor.segment) return false;

    //what scale is this segment on?
    let scale = scales[node.json.anchor.segment.scale];
    //console.log(scale(new Date("2006")));
    let scaledSegment = node.json.anchor.segment.values.map((value) => {
      if (scale.type == "time") value = new Date(value);
      return scale(value);
    });

    //does this scale horizontal or vertical (TODO: Make this robust, right now freely chosen axis names determine direction)
    let coords = {};
    if (node.json.anchor.segment.scale.includes("x")) {
      node.mark.center = {
        x: scaledSegment[0] + (scaledSegment[1] - scaledSegment[0]) / 2,
        y: node.mark.center.y,
      };
      coords = {
        x1: scaledSegment[0],
        x2: scaledSegment[1],
        y1: -1000,
        y2: 1000,
      };
    } else {
      node.mark.center = {
        x: node.mark.center.x,
        y: scaledSegment[0] + (scaledSegment[1] - scaledSegment[0]) / 2,
      };
      coords = {
        x1: -1000,
        x2: 1000,
        y1: scaledSegment[0],
        y2: scaledSegment[1],
      };
    }

    let d = `M ${coords.x1} ${coords.y1} L ${coords.x2} ${coords.y1} L ${coords.x2} ${coords.y2} L ${coords.x1} ${coords.y2} z`;

    return {
      d: d,
      translate: null,
    };
  }

  function move(svg) {
    svg.anchors
      .attr("transform", (d) =>
        d.mark && d.mark.transform ? d.mark.transform : ""
      )
      .attr("d", (d) => (d.mark ? d.mark.d : ""));

    svg.segments.attr("d", (d) => (d.segment ? d.segment.d : ""));
    svg.simulation.alphaTarget(0.1).restart();
  }

  function updateAnnotations(svg, network, scales) {
    network.nodes
      // .filter((node) => node.type == "anchor") //uset this to check node visibility??
      .forEach((node) => {
        if (node.type == "anchor") {
          node.mark = getMark(node);
          node.segment = getSegment(node, scales);
          node.fx = node.mark.center.x;
          node.fy = node.mark.center.y;
        }
      });

    //trigger overlay and desaturation of underlying visualization
    d3.select(".role-frame").classed("desaturate", config.desaturate);
    //svg.overlay.attr("opacity", view.signal("annotate") ? 0 : 0);

    //filter based on categories (THIS IS JUST FOR DEMO AND WILL BE DONE IN THE OUTSIDE FRAMEWORK)

    move(svg);
  }

  function createSVG(network) {
    let svg = d3.select("svg");

    //create overlay rectangle and filter event

    svg
      .append("filter")
      .attr("id", "desaturate")
      .attr("filterUnits", "objectBoundingBox")
      .append("feColorMatrix")
      .attr("type", "saturate")
      .attr("in", "SourceGraphic")
      .attr("values", 0);

    let overlay = svg
      .append("rect")
      .attr("id", "overlay")
      .attr("opacity", 0)
      .attr(
        "width",
        config.view.getState().signals.width +
          config.view.padding().left +
          config.view.padding().right
      )
      .attr(
        "height",
        config.view.getState().signals.height +
          config.view.padding().top +
          config.view.padding().bottom
      )
      .attr("x", 0)
      .attr("y", 0);

    //align annotation coordinates with underlaying vega coordinates
    let translate = config.view
      .origin()
      .map((val, i) =>
        i ? val + config.view.padding().top : val + config.view.padding().left
      );

    let annotationLayer = svg
      .insert("g")
      .attr("class", "annotations")
      .attr("transform", `translate(${translate.join(",")})`);

    //CREATE GROUPS FOR ANCHORS AND THEIR CLIPPATHS
    let anchorGroups = annotationLayer
      .append("g")
      .attr("class", "anchorGroup")
      .selectAll("g")
      .data(network.nodes)
      .join(
        (enter) => enter.append("g"),
        (exit) => exit.remove("g")
      );

    let segments = anchorGroups
      .append("clipPath")
      .attr("id", (d) => d.id + "-clipPath")
      .append("path");

    let anchors = anchorGroups
      .attr("id", (d) => d.id)
      .append("path")
      .attr("fill", (d) => getColor(d, 0.2))
      .attr("stroke", (d) => getColor(d))
      .attr("clip-path", (d) =>
        d.json.anchor.segment ? `url(#${d.id}-clipPath)` : ""
      ); //only apply a clippath if it is mentioned in the json

    //CREATE GROUPS FOR CONTENT AND ITS BACKGROUNDS
    let contentGroups = annotationLayer
      .append("g")
      .attr("class", "contentGroup")
      .selectAll("g")
      .data(network.nodes.filter((node) => node.type == "content"))
      .join("g");

    let backgrounds = contentGroups
      .append("rect")
      .text((d) => d.json.content.text)
      .attr("fill", (d) => getColor(d));

    let contents = contentGroups
      .append("text")
      .attr("fill", "white")
      .attr("text-anchor", "middle");

    contents
      .selectAll("tspan")
      .data((d) => d.text)
      .enter()
      .append("tspan")
      .text((d) => d)
      .attr("x", 0)
      .attr("dy", (d, i) => i * 11);

    //get dimensions of text after rendering and adapt size of background
    contents.call(getBB);
    backgrounds.attr("width", (d) => d.bbox.width);
    backgrounds.attr("height", (d) => d.bbox.height);
    backgrounds.attr("transform", (d) => `translate(${d.bbox.x},${d.bbox.y})`);

    function getBB(selection) {
      selection.each(function (d) {
        d.bbox = this.getBBox();
      });
    }

    //CREATE GROUPS FOR LINKS (TODO: AND THEIR CLIPPATHS)
    let linksGroups = annotationLayer
      .append("g")
      .attr("class", "linkGroup")
      .selectAll("g")
      .data(network.links)
      .join("g");

    let links = linksGroups.append("line").attr("stroke", (d) => getColor(d));

    //CREATE FORCE GRAPH FOR LABEL PLACEMENT
    var simulation = d3
      .forceSimulation(network.nodes)
      .alphaDecay(0.1)
      .force("charge", d3.forceManyBody().strength(1))
      //.force("center", d3.forceCenter())
      .force(
        "collide",
        d3.forceCollide().radius((d) => (d.type == "content" ? 0 : 100))
      )
      .force(
        "link",
        d3
          .forceLink()
          .links(network.links)
          .id((d) => d.id)
          .distance(10)
      )
      .on("tick", ticked);

    function ticked() {
      contentGroups.attr("transform", (d) => {
        return `translate(${d.x},${d.y})`;
      });

      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x) //TODO Get width and calculate max values
        .attr("y2", (d) => d.target.y);
    }

    return {
      anchors: anchors,
      contents: contents,
      links: links,
      simulation: simulation,
      segments: segments,
      overlay: overlay,
    };
  }

  function buildNetwork(annotations) {
    let network = {
      nodes: [],
      links: [],
    };
    annotations.forEach((annotation) => {
      //PUSH ANCHOR NODES
      network.nodes.push({
        type: "anchor",
        id: "anchor-" + annotation.json.id,
        json: annotation.json,
        target: annotation.target,
        display: true,
      });

      //PUSH CONTENT NODES
      network.nodes.push({
        type: "content",
        id: "content-" + annotation.json.id,
        json: annotation.json,
        text: annotation.json.content.text.split("\n"),
        //target: annotation.target, //maybe i dont need this
      });

      network.links.push({
        source: "anchor-" + annotation.json.id,
        target: "content-" + annotation.json.id,
        json: annotation.json,
      });
    });
    return network;
  }

  function parse(json) {
    return json.map((annotation) => {
      return {
        json: annotation, //move this to a lower level
        target: findSource(
          //use VEGA Symbols to identify values of target element
          annotation.target,
          config.view.scenegraph().root.items[0]
        ),
      };
    });

    function findSource(target, root) {
      const recursiveItemSearch = (id, item) => {

        if (id == item[Object.getOwnPropertySymbols(item)[0]]) {
          return item;
        }

        if (item.items) {
          for (const child of item.items) {
            const found = recursiveItemSearch(id, child);
            if (found) {
              return found;
            }
          }
        }
      };
      if (typeof target.id == "number") target.id = [target.id];
      if (target.type == "axis") {
        let axes = root.items.filter((item) => item.role == "axis");
        return axes.find((axis) => axis.items[0].datum.scale == target.id);
      } else {
        return target.id.map((target) => {
          return recursiveItemSearch(target, root);
        });
      }
    }
  }

  function getColor(d, opacity) {
    const colorScale = d3
      .scaleOrdinal()
      .range(["red", "green", "blue"])
      .domain(config.categories);

    let category =
      d.json.meta && d.json.meta.category
        ? d.json.meta.category
        : "uncategorized";

    let color = d3.rgb(colorScale(category));
    color.opacity = opacity ? opacity : 1;

    return color;
  }
}




</script>

<template>
  <main>
    <div id="vis">
      <svg id="foobar"></svg>
    </div>
  </main>
</template>
