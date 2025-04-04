// components/dashboard/activity-charts.tsx
"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getAnalytics } from "@/lib/analytics-utils";
import { ShortenedUrl } from "@/types";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";
import { getAccessToken } from "@/actions/auth-actions";

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

const fetcher = async (url: string) => {
  const accessToken = await getAccessToken();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  return response.json();
};

const ActivityCharts = () => {
  const {
    data: urls,
    error,
    isLoading,
  } = useSWR<ShortenedUrl[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/urls`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !urls) {
    console.error(error);
    return <div>Failed to load analytics data</div>;
  }

  const { dailyClicks, deviceStats } = getAnalytics(urls);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Clicks Last 30 Days</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyClicks}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {deviceStats.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityCharts;
