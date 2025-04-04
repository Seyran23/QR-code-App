// components/dashboard/recent-activity.tsx
"use client";

import { QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import useSWR from "swr";
import { getAccessToken } from "@/actions/auth-actions";
import { ShortenedUrl, QRCode as QrCodeType } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { getRecentItems } from "@/lib/analytics-utils";

const fetcher = async (url: string) => {
  const accessToken = await getAccessToken();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

const RecentActivity = () => {
  const { data: urls, isLoading: urlsLoading } = useSWR<ShortenedUrl[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/urls`,
    fetcher
  );

  const { data: qrCodes, isLoading: qrLoading } = useSWR<QrCodeType[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/qr-codes`,
    fetcher
  );

  const recentURLs = urls ? getRecentItems(urls) : [];
  const recentQRs = qrCodes ? getRecentItems(qrCodes) : [];

  if (urlsLoading || qrLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Short URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short URL</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentURLs.map((url) => (
                <TableRow key={url.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/urls/${url.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {url.shortUrl}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{url.clickCount}</TableCell>
                </TableRow>
              ))}
              {recentURLs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground"
                  >
                    No recent URLs
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent QR Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentQRs.map((qr) => (
              <div
                key={qr.id}
                className="border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <Link href={`/dashboard/qr-codes/${qr.id}`}>
                  <div className="flex items-center gap-3">
                    <QrCode className="h-6 w-6" />
                    <div>
                      <h4 className="font-medium">{qr.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {qr.scanCount} scans
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            {recentQRs.length === 0 && (
              <div className="text-center text-muted-foreground col-span-2 py-4">
                No recent QR codes
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
