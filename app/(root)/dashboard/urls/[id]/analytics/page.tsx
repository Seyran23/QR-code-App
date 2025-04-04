// app/dashboard/urls/[id]/analytics/page.tsx
"use client";


import { useEffect, useState } from "react";
import { UrlInfoCard } from "@/components/url-analytics/UrlInfoCard";
import { TotalClicksCard } from "@/components/url-analytics/TotalClicksCard";
import { BrowserStatsCard } from "@/components/url-analytics/BrowserStatsCard";
import { ReferrerStatsTable } from "@/components/url-analytics/ReferrerStatsTable";
import { getAccessToken } from "@/actions/auth-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { URLAnalyticsData } from "@/types";



export default function AnalyticsContainer() {
  const { id } = useParams();

  const [analytics, setAnalytics] = useState<URLAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessToken();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/urls/${id}/analytics`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const rawData = await response.json();
        setAnalytics(rawData);
      } catch (error) {
        console.error("Error fetching scans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <UrlInfoCard url={analytics.url} />
      <TotalClicksCard
        dailyClicks={analytics.dailyClicks}
        totalClicks={analytics.totalClicks}
      />
      <BrowserStatsCard browserStats={analytics.browserStats} />
      <ReferrerStatsTable referrerStats={analytics.referrerStats} />
    </div>
  );
}
