// // StackedBarChart.js
// import React from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const data = [
//   {
//     name: 'PDF',
//     Total: 44, // 1980 to 2025 → 45 total → Total = Total - Pending
//     InProcess: 41, // Everything except 2024 and before (i.e., 1980-2023 → 44 years)
//     Pending: 1, // Only 2024
//   },
//   {
//     name: 'Images',
//     Total: 44,
//     InProcess: 41,
//     Pending: 1,
//   },
//   {
//     name: 'YT-Videos',
//     Total: 40, // Total = 2025 - 1980 - 5 = 40
//     InProcess: 35,
//     Pending: 5, // Pending from 2020 to 2025
//   },
// ];
// const StackedBarChart = () => {
//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <BarChart
//         data={data}
//         margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
//         barCategoryGap={30}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis
//           domain={[0, 45]}
//           ticks={[0, 5, 10, 15, 20, 25, 30, 35,40,45]}
//           tickFormatter={(val) => 1980 + val}
//         />
//         <Tooltip
//           formatter={(value, name) => [`${value} yrs`, name]}
//           labelFormatter={(label) => label}
//         />
//         <Legend />
//         <Bar dataKey="Total" stackId="a" fill="#0078D4" /> {/* Standard Blue */}
//         <Bar dataKey="InProcess" stackId="a" fill="#F2C80F" /> {/* Yellow */}
//         <Bar dataKey="Pending" stackId="a" fill="#B0D137" /> {/* Green */}
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default StackedBarChart;
// StackedBarChart.js
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Updated data with Completed + InProcess + Pending = Total (45)
const data = [
  {
    name: 'PDF',
    Completed: 3,      // 1980–1982
    InProcess: 11,     // 1983–2023
    Pending: 30,        // 2024
  },
  {
    name: 'Images',
    Completed: 3,
    InProcess: 10,
    Pending: 31,
  },
  {
    name: 'YT-Videos',
    Completed: 29,      // 1980–1984
    InProcess: 10,     // 1985–2019
    Pending: 5,        // 2020–2024
  },
];

const StackedBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        barCategoryGap={30}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          domain={[0, 45]}
          ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45]}
          tickFormatter={(val) => 1980 + val}
        />
        <Tooltip
          formatter={(value, name) => [`${value} yrs`, name]}
          labelFormatter={(label) => label}
        />
        <Legend />
        
        {/* Stack: Completed (Green), InProcess (Yellow), Pending (Red) */}
       
       
        <Bar dataKey="Pending" stackId="progress" fill="#0078D4" />    
         <Bar dataKey="InProcess" stackId="progress" fill="#FBC02D" />  {/* Yellow */}
         <Bar dataKey="Completed" stackId="progress" fill="#4CAF50" />  {/* Green */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
