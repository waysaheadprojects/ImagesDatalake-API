import React, { useEffect, useState } from "react";
import { POST_REQUEST } from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
  RadialBarChart, RadialBar,
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#d0ed57'];

const TestPage=()=>{
    
const[data,setData]=useState();
const getChartData=async()=>{
    const response=await POST_REQUEST("https://waysaheadglobal-mcp.hf.space/dashboard",{prompt:"Generate an extensive dashboard from the zoho table"});
    console.log(response?.data)
    setData(response?.data);
}
useEffect(()=>{
    getChartData();
},[])
    return (
        <ChartDashboard data={data}/>
      
    )
}



const ChartDashboard = ({ data }) => {
  const metrics = data?.metrics || [];

  const totalLeadsData = metrics?.[0]?.data?.[0] || {};
  const regionData = metrics?.[1]?.data || [];
  const countryData = metrics?.[2]?.data || [];
  const categoryData = metrics?.[3]?.data || [];
  const timeSeriesData = metrics?.[4]?.data || [];
    console.log(countryData,"TotalLeadsData")
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      {/* Radial Bar (Gauge-like) Chart - Total Leads */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Total Leads</h2>
        <RadialBarChart
          width={300}
          height={300}
          innerRadius="80%"
          outerRadius="100%"
          data={[{ name: 'Leads', value: totalLeadsData.total_leads || 0, fill: '#8884d8' }]}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar minAngle={15} background clockWise dataKey="value" />
          <Tooltip />
        </RadialBarChart>
        <div className="text-center mt-2 font-bold text-xl">{totalLeadsData.total_leads || 0}</div>
      </div>

      {/* Bar Chart - Leads by Region */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Leads by Region</h2>
        <BarChart width={400} height={300} data={regionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="lead_count" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Pie Chart - Leads by Country */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Leads by Country</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={countryData}
            dataKey="lead_count"
            nameKey="country"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#82ca9d"
            label
          >
            {countryData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Pie Chart - Leads by Category */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Leads by Category</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={categoryData}
            dataKey="lead_count"
            nameKey="main_category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#ffc658"
            label
          >
            {categoryData.map((_, index) => (
              <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Line Chart - Leads Over Time */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Leads Over Time</h2>
        <LineChart width={400} height={300} data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="lead_date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="lead_count" stroke="#ff8042" />
        </LineChart>
      </div>
    </div>
  );
};


export default TestPage
