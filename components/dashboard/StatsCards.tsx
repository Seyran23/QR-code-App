// components/dashboard/stats-cards.tsx
"use client";

import useSWR from "swr";
import { getAccessToken } from "@/actions/auth-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/analytics-utils";
import { Link2, QrCode, MousePointerClick } from "lucide-react";
import GrowthIndicator from "./GrowthIndicator";

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

const useShorthenedURLs = () => {
  const { data, error, mutate, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/urls`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return {
    shorthenedURLs: data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

const useQRCodes = () => {
  const { data, error, mutate, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/qr-codes`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return {
    qrCodes: data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

const DashboardStatsCards = () => {
  const { shorthenedURLs } = useShorthenedURLs();
  const { qrCodes } = useQRCodes();

  const {
    totalURLs,
    totalQRs,
    urlGrowth,
    qrGrowth,
    totalClicks,
    totalScans,
    recentClicks,
    recentScans,
  } = getDashboardStats(shorthenedURLs, qrCodes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Short URLs</CardTitle>
          <Link2 className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold">{totalURLs}</span>
            <GrowthIndicator value={urlGrowth} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            vs previous month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>QR Codes</CardTitle>
          <QrCode className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold">{totalQRs}</span>
            <GrowthIndicator value={qrGrowth} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            vs previous month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Total Clicks</CardTitle>
          <MousePointerClick className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{totalClicks}</span>
          <p className="text-sm text-muted-foreground mt-2">
            24h: {recentClicks}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Total Scans</CardTitle>
          <MousePointerClick className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{totalScans}</span>
          <p className="text-sm text-muted-foreground mt-2">
            24h: {recentScans}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
