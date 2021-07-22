/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-22 15:32:33
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-22 21:57:10
 * @FilePath: \mindmap\src\App.tsx
 */
import * as d3 from 'd3';
import { useEffect } from 'react';

const data = require('./flare-2.json');

function App() {
  useEffect(() => {
    interface t extends d3.HierarchyNode<any> {
      x0?: number;
      y0?: number;
      x?: number;
      y?: number;
    }
    const root: t = d3.hierarchy(data) || { x: 0, y: 0 };

    const diagonal: any = d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x);

    const width = 600;

    const dx = 10;

    const dy = width / 6;

    const tree = d3.tree().nodeSize([dx, dy]);

    const margin = ({
      top: 10, right: 120, bottom: 10, left: 40,
    });

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d: any, i: any) => {
      d.id = i;
      d.data._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    const svg = d3.select('#container')
      .append('svg')
      .attr('viewBox', `${[-margin.left, -margin.top, width, dx]}`)
      .style('font', '10px sans-serif')
      .style('user-select', 'none');

    const gLink = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    const gNode = svg.append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');

    function update(source: any) {
      const duration = 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore((node: any) => {
        if (node.x < (left.x || 0)) left = node;
        if (node.x > (right.x || 0)) right = node;
      });

      const height = (right.x || 0) - (left.x || 0) + margin.top + margin.bottom;

      const transition: any = svg.transition()
        .duration(duration)
        .attr('viewBox', `${[-margin.left, (left.x || 0) - margin.top, width, height]}`);

      // Update the nodes…
      const node = gNode.selectAll('g')
        .data(nodes, (d: any) => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter: any = node.enter().append('g')
        .attr('transform', () => `translate(${source.y0},${source.x0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', (event, d) => {
          d.children = d.children ? null : d.data._children;
          update(d);
        });

      nodeEnter.append('circle')
        .attr('r', 2.5)
        .attr('fill', (d: t) => (d.data._children ? '#00f' : '#0f0'))
        .attr('stroke-width', 10);

      nodeEnter.append('text')
        .attr('dy', '0.31em')
        .attr('x', (d: t) => (d.data._children ? -6 : 6))
        .attr('text-anchor', (d: t) => (d.data._children ? 'end' : 'start'))
        .text((d: t) => d.data.name)
        .clone(true)
        .lower()
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .attr('stroke', 'white');

      // Transition nodes to their new position.
      node.merge(nodeEnter).transition(transition)
        .attr('transform', (d: t) => `translate(${d.y},${d.x})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      node.exit().transition(transition).remove()
        .attr('transform', () => `translate(${source.y},${source.x})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      // Update the links…
      const link = gLink.selectAll('path')
        .data(links, (d: any) => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter: any = link.enter().append('path')
        .attr('d', () => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
        .attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
        .attr('d', () => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      // Stash the old positions for transition.
      root.eachBefore((d: t) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);

    svg.node();
  }, []);
  return (
    <div className="App" id="container" />
  );
}

export default App;
