import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LabelList } from 'recharts';

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  yLabel?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, xKey, yKey, yLabel }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis tickFormatter={v => v.toLocaleString('vi-VN')} label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft' } : undefined} />
        <Tooltip formatter={(value: number) => value.toLocaleString('vi-VN')} />
        <Legend />
        <Bar dataKey={yKey} fill="#3182ce" name={yLabel || yKey}>
          <LabelList dataKey={yKey} position="top" formatter={(v: number) => v.toLocaleString('vi-VN')} />
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;