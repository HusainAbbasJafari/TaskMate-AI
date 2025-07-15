// src/Components/StatusDonutChart.jsx
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import '../tailwind.css' ;
const data = [
  { name: "To Do", value: 50 },
  { name: "In Progress", value: 30 },
  { name: "Done", value: 20 },
];

const COLORS = ["#60a5fa", "#fbbf24", "#10b981"];

export default function StatusDonutChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
