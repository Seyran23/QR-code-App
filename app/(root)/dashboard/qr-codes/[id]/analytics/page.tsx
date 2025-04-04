// app/dashboard/qr-codes/[id]/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  processScans,
  calculateSummary,
} from "@/lib/analytics-utils";

import { SummaryCards } from "@/components/qrcode-analytics/SummaryCards";
import { TimeChart } from "@/components/qrcode-analytics/TimeChart";
import { DeviceBreakdown } from "@/components/qrcode-analytics/DeviceBreakdown";
import { ScanTable } from "@/components/qrcode-analytics/ScanTable";


import { Skeleton } from "@/components/ui/skeleton";
import { getAccessToken } from "@/actions/auth-actions";
import { EnhancedScan, QRCode } from "@/types";
import { ReferrerBreakdown } from "@/components/qrcode-analytics/ReferrerBreakdown";

export default function AnalyticsPage() {
    const { id } = useParams();
  const [scans, setScans] = useState<EnhancedScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessToken();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/qr-codes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const qrCodeData: QRCode = await response.json();
        const processedScans = processScans(qrCodeData.scans);
        setScans(processedScans);
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

  const summary = calculateSummary(scans);

  return (
    <div className="p-6 space-y-6">
    <SummaryCards summary={summary} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TimeChart scans={scans} />
      <DeviceBreakdown scans={scans} />
      <ReferrerBreakdown scans={scans} />
    </div>
    <ScanTable scans={scans} />
  </div>
  );
}
