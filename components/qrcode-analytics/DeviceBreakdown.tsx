// components/DeviceBreakdown.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { EnhancedScan } from '@/types';


export const DeviceBreakdown = ({ scans }: { scans: EnhancedScan[] }) => {
  const browserData = Object.entries(
    scans.reduce((acc, scan) => {
      acc[scan.browser] = (acc[scan.browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Browser Usage</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={browserData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {browserData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};