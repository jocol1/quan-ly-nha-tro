import React from 'react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#34d399', '#f87171']; // Xanh cho đã thanh toán, đỏ cho chưa thanh toán

interface PieChartProps {
  data: { name: string; value: number }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RePieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={90}
        label
      >
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value: number) => value.toLocaleString('vi-VN')} />
      <Legend />
    </RePieChart>
  </ResponsiveContainer>
);

export default PieChart;