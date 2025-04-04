// components/url-analytics/TotalClicksCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { TotalClicksCardProps } from "@/types";

export function TotalClicksCard({ dailyClicks, totalClicks }: TotalClicksCardProps) {
  const chartData = dailyClicks.map(day => ({
    date: format(new Date(day.date), "MMM dd"),
    count: day.count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Clicks: {totalClicks}</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              allowDecimals={false}
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip />
            <Bar 
              dataKey="count" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}