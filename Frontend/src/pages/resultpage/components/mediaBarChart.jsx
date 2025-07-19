import React, { useEffect, useRef,useState } from 'react';
import * as d3 from 'd3';

const DataStatusBarChart = () => {
    const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv('/data_status.csv').then(d => setData(d));
  }, []);
  const svgRef = useRef();

  useEffect(() => {
    // Dimensions
    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 70, left: 60 };

    // Remove old svg
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Group data
    const groupedData = d3.groups(data, d => d.year, d => d.filetype);

    // Flatten data to [{year, filetype, processed_status, filecount}]
    const flatData = [];
    data.forEach(d => {
      flatData.push({
        year: d.year,
        filetype: d.filetype,
        processed_status: d.processed_status,
        filecount: +d.filecount
      });
    });

    const x0 = d3.scaleBand()
      .domain(flatData.map(d => d.filetype))
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    const years = [...new Set(flatData.map(d => d.year))];
    const x1 = d3.scaleBand()
      .domain(years)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(flatData, d => d.filecount)]).nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(years)
      .range(d3.schemeCategory10);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Bars
    svg.append("g")
      .selectAll("g")
      .data(d3.group(flatData, d => d.filetype))
      .join("g")
        .attr("transform", d => `translate(${x0(d[0])},0)`)
      .selectAll("rect")
      .data(d => d[1])
      .join("rect")
        .attr("x", d => x1(d.year))
        .attr("y", d => y(d.filecount))
        .attr("width", x1.bandwidth())
        .attr("height", d => y(0) - y(d.filecount))
        .attr("fill", d => color(d.year));

    // Legend
    svg.append("g")
      .selectAll("circle")
      .data(years)
      .join("circle")
        .attr("cx", (d,i) => 100 + i*100)
        .attr("cy", 20)
        .attr("r", 6)
        .style("fill", d => color(d));

    svg.append("g")
      .selectAll("text")
      .data(years)
      .join("text")
        .attr("x", (d,i) => 110 + i*100)
        .attr("y", 25)
        .text(d => d)
        .attr("font-size", "12px")
        .attr("alignment-baseline","middle");
  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default DataStatusBarChart;
