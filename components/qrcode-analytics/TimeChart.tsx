// components/TimeChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { EnhancedScan } from '@/types';

export const TimeChart = ({ scans }: { scans: EnhancedScan[] }) => {
  const hourlyData = Array(24).fill(0).map((_, hour) => ({
    hour: `${hour}:00`,
    scans: scans.filter(s => s.scannedAt.getHours() === hour).length
  }));

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Scan Activity by Hour</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="scans" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};