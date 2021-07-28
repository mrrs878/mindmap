/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-22 15:32:33
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-28 21:09:01
 * @FilePath: \mindmap\src\App.tsx
 */
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { Input, Modal } from 'antd';
import 'antd/dist/antd.css';

const data = require('./flare-2.json');

function wrapWord(text: string, lineLength = 100, abs = 5) {
  let res = '';
  let line = '';
  const lineHeight = 12;
  const words = text.split(' ');
  let lineNumber = 0;
  for (let i = 0; i < words.length; i += 1) {
    if ((line + words[i]).length > lineLength + abs) {
      line = `<tspan x=5 y=${lineHeight * lineNumber}>${line}</tspan>`;
      res += line;
      line = words[i];
      lineNumber += 1;
    } else line += ` ${words[i]}`;
  }

  res += `<tspan x=5 y=${lineHeight * lineNumber}>${line}</tspan>`;
  return res;
}

function App() {
  const editNodeRef = useRef<SVGTextElement>();
  const [editNodeModalF, setEditNodeModalF] = useState(false);
  const [editNodeModalV, setEditNodeModalV] = useState('');

  const onEditNode = () => {
    if (editNodeRef.current) {
      editNodeRef.current.innerHTML = wrapWord(editNodeModalV, 30);
      setEditNodeModalF(false);
    }
  };

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

    const dx = 12;

    const dy = width / 6;

    const tree = d3.tree().nodeSize([dx, dy]);

    const margin = ({
      top: 100, right: 120, bottom: 10, left: 200,
    });

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d: any, i: any) => {
      d.id = i;
      d.data.expand = false;
      d.data._children = d.children;
      d.children = null;
    });

    const svg = d3.select('#container')
      .append('svg')
      .attr('viewBox', `${[-margin.left, -margin.top, width, dx]}`)
      .style('font', '10px sans-serif')
      .style('overflow', 'inherit')
      .style('user-select', 'none');

    const gLink = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#f00')
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

      const transition = svg.transition()
        .duration(duration)
        .attr('viewBox', `${[-margin.left, (left.x || 0) - margin.top, width, height]}`);

      // Update the nodes…
      const node = gNode.selectAll('g')
        .data(nodes, (d: any) => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append('g')
        .attr('transform', `translate(${source.y0},${source.x0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      nodeEnter.append('circle')
        .attr('r', 5)
        .attr('fill', (d: t) => (d.data._children ? 'rgb(254, 67, 101)' : 'rgb(160, 191, 124)'))
        .attr('stroke-width', 10);

      nodeEnter.append('text')
        .attr('x', (d: t) => (d.data._children ? -40 : 6))
        .html((d: t) => wrapWord(d.data.name, 30))
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', (d: t) => (d.data._children ? 'end' : 'start'))
        .on('dblclick', function onDBLClick(e, d) {
          editNodeRef.current = this;
          setEditNodeModalF(true);
          setEditNodeModalV(d.data.name);
        })
        .lower()
        .attr('stroke-linejoin', 'round');

      nodeEnter.append('text')
        .attr('dy', '0.32em')
        .attr('dx', '-0.36em')
        .attr('fill', '#fff')
        .text((d: t) => (d.data._children ? '+' : ''))
        .on('click', function onClick(event, d) {
          d.data.expand = !d.data.expand;
          this.setAttribute('dx', d.data.expand ? '-0.24em' : '-0.36em');
          this.innerHTML = d.data.expand ? '-' : '+';
          d.children = d.children ? null : d.data._children;
          update(d);
        });

      // Transition nodes to their new position.
      node.merge(nodeEnter as any).transition(transition as any)
        .attr('transform', (d: t) => `translate(${d.y},${d.x})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      node.exit().transition(transition as any).remove()
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
      link.merge(linkEnter).transition(transition as any)
        .attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition as any).remove()
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
    <>
      <div className="App" id="container" />
      <Modal
        visible={editNodeModalF}
        closable={false}
        onCancel={() => setEditNodeModalF(false)}
        onOk={onEditNode}
      >
        <Input.TextArea
          value={editNodeModalV}
          onChange={(e) => setEditNodeModalV(e.currentTarget.value)}
        />
      </Modal>
    </>
  );
}

export default App;
