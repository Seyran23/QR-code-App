// components/url-analytics/BrowserStatsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

interface BrowserStatsCardProps {
  browserStats: { browser: string; count: number }[];
}

export function BrowserStatsCard({ browserStats }: BrowserStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Browser Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={browserStats}
              dataKey="count"
              nameKey="browser"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {browserStats.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}