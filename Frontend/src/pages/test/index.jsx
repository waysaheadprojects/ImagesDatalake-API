import React, { useEffect, useState,useRef } from "react";
import { POST_REQUEST } from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
  RadialBarChart, RadialBar,
} from "recharts";
import * as d3 from "d3";
import BarRaceChart from "../resultpage/components/insightRaceBarChart";

const TestPage = () => {
 const sampleData = [
  { date: "2020", name: "USA", value: 300 },
  { date: "2020", name: "India", value: 250 },
  { date: "2020", name: "China", value: 270 },
  { date: "2021", name: "USA", value: 310 },
  { date: "2021", name: "India", value: 260 },
  { date: "2021", name: "China", value: 280 },
  { date: "2022", name: "USA", value: 320 },
  { date: "2022", name: "India", value: 290 },
  { date: "2022", name: "China", value: 300 },
];
  return (
       <BarRaceChart />
  );
};


export default TestPage


// const BarRaceChart = ({ data, width = 800, height = 500, interval = 1500 }) => {
//   const svgRef = useRef();
//   const [step, setStep] = useState(0);

//   const margin = { top: 40, right: 100, bottom: 40, left: 100 };
//   const chartWidth = width - margin.left - margin.right;
//   const chartHeight = height - margin.top - margin.bottom;

//   // Extract unique time steps from data
//   const timeSteps = Array.from(new Set(data.map(d => d.date))).sort();

//   useEffect(() => {
//     if (!data || data.length === 0) return;

//     const svg = d3.select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height);

//     const chart = svg.selectAll("g.chart")
//       .data([null])
//       .join("g")
//       .attr("class", "chart")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     const x = d3.scaleLinear().range([0, chartWidth]);
//     const y = d3.scaleBand().range([0, chartHeight]).padding(0.1);
//     const color = d3.scaleOrdinal(d3.schemeCategory10);

//     const update = (currentData) => {
//       const topN = 10;
//       const sorted = currentData.sort((a, b) => b.value - a.value).slice(0, topN);

//       x.domain([0, d3.max(sorted, d => d.value)]);
//       y.domain(sorted.map(d => d.name));

//       // Bars
//       const bars = chart.selectAll(".bar")
//         .data(sorted, d => d.name);

//       bars.join(
//         enter => enter.append("rect")
//           .attr("class", "bar")
//           .attr("x", 0)
//           .attr("y", d => y(d.name))
//           .attr("height", y.bandwidth())
//           .attr("fill", d => color(d.name))
//           .attr("width", 0)
//           .transition().duration(interval - 200)
//           .attr("width", d => x(d.value)),

//         update => update
//           .transition().duration(interval - 200)
//           .attr("y", d => y(d.name))
//           .attr("width", d => x(d.value)),

//         exit => exit
//           .transition().duration(interval - 200)
//           .attr("width", 0)
//           .remove()
//       );

//       // Labels
//       const labels = chart.selectAll(".label")
//         .data(sorted, d => d.name);

//       labels.join(
//         enter => enter.append("text")
//           .attr("class", "label")
//           .attr("y", d => y(d.name) + y.bandwidth() / 2)
//           .attr("x", d => x(d.value) + 5)
//           .attr("alignment-baseline", "middle")
//           .text(d => `${d.name} (${d.value})`)
//           .style("font-size", "12px")
//           .style("fill", "black"),

//         update => update
//           .transition().duration(interval - 200)
//           .attr("y", d => y(d.name) + y.bandwidth() / 2)
//           .attr("x", d => x(d.value) + 5)
//           .text(d => `${d.name} (${d.value})`),

//         exit => exit.remove()
//       );
//     };

//     update(data.filter(d => d.date === timeSteps[step]));

//     const timer = setInterval(() => {
//       setStep(prev => {
//         if (prev + 1 >= timeSteps.length) {
//           clearInterval(timer);
//           return prev;
//         }
//         return prev + 1;
//       });
//     }, interval);

//     return () => clearInterval(timer);
//   }, [data, step]);

//   return (
//     <div>
//       <svg ref={svgRef}></svg>
//       <p style={{ textAlign: "center", fontWeight: "bold" }}>
//         {timeSteps[step]}
//       </p>
//     </div>
//   );
// };


