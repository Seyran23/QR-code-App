// lib/analytics-utils.ts
import {
  QRCodeAnalyticsSummary,
  EnhancedScan,
  Scan,
  ShortenedUrl,
  User,
  QRCode,
  DailyClick,
  DeviceStat,
  GrowthStats,
  DashboardStats,
} from "@/types";
import { UAParser } from "ua-parser-js";

export const processScans = (scans: Scan[]): EnhancedScan[] => {
  return scans.map((scan) => {
    const parser = new UAParser(scan.userAgent);
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const deviceType = parser.getDevice().type || "Desktop";

    const date = new Date(scan.scannedAt);
    const hours = date.getHours();
    const timeOfDay =
      hours < 5
        ? "Night"
        : hours < 12
        ? "Morning"
        : hours < 17
        ? "Afternoon"
        : "Evening";

    return {
      id: scan.id,
      scannedAt: date,
      ipAddress: scan.ipAddress,
      browser,
      os,
      deviceType,
      isMobile: deviceType === "mobile",
      timeOfDay,
      referer: scan.referer || "Direct",
    };
  });
};

export const calculateSummary = (
  scans: EnhancedScan[]
): QRCodeAnalyticsSummary => {
  const totalScans = scans.length;

  const uniqueIPs = new Set(scans.map((s) => s.ipAddress)).size;

  const browserCounts = scans.reduce((acc, scan) => {
    acc[scan.browser] = (acc[scan.browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const osCounts = scans.reduce((acc, scan) => {
    acc[scan.os] = (acc[scan.os] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mobileCount = scans.filter((s) => s.isMobile).length || 0;

  const hourCounts = scans.reduce((acc, scan) => {
    const hour = scan.scannedAt.getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const referrerCounts = scans.reduce((acc, scan) => {
    const referrer = scan.referer || "Direct";
    acc[referrer] = (acc[referrer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalScans,
    uniqueVisitors: uniqueIPs,
    mostPopularBrowser:
      Object.entries(browserCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A",
    mostPopularOS:
      Object.entries(osCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A",
    mobilePercentage: (mobileCount / totalScans) * 100,
    busiestHour:
      Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] + ":00" ||
      "N/A",
    mostCommonReferrer:
      Object.entries(referrerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Direct",
  };
};

// dashboard
export function getDashboardStats(urls: ShortenedUrl[], qrCodes: QRCode[], user?: User): DashboardStats {
  // Calculate URL growth
  const urlStats = calculateGrowth(
    urls,
    (item) => new Date(item.createdAt)
  )
  
  // Calculate QR code growth
  const qrStats = calculateGrowth(
    qrCodes,
    (item) => new Date(item.createdAt)
  )

  // Calculate total clicks/scans
  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0)
  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)

  // Calculate recent clicks (last 24 hours)
  const recentClicks = urls.reduce((sum, url) => {
    const urlRecentClicks = url.clicks.filter(click => {
      const clickDate = new Date(click.clickedAt)
      return Date.now() - clickDate.getTime() <= 24 * 60 * 60 * 1000
    }).length
    return sum + urlRecentClicks
  }, 0)

  // Calculate recent scans (last 24 hours)
  const recentScans = qrCodes.reduce((sum, qr) => {
    const qrRecentScans = qr.scans?.filter(scan => {
      const scanDate = new Date(scan.scannedAt)
      return Date.now() - scanDate.getTime() <= 24 * 60 * 60 * 1000
    }).length || 0
    return sum + qrRecentScans
  }, 0)

  return {
    totalURLs: urlStats.currentCount,
    urlGrowth: urlStats.percentageChange,
    totalQRs: qrStats.currentCount,
    qrGrowth: qrStats.percentageChange,
    totalClicks,
    totalScans,
    recentClicks,
    recentScans,
    user: {
      name: user?.fullName || 'Anonymous',
      email: user?.email || '',
      userId: user?.id || 'unknown'
    }
  }
}


function calculateGrowth<T>(
  items: T[],
  getDate: (item: T) => Date
): GrowthStats {
  const now = new Date()
  const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const currentCount = items.filter(item => 
    getDate(item) >= currentPeriodStart
  ).length

  const previousCount = items.filter(item =>
    getDate(item) >= previousPeriodStart && 
    getDate(item) <= previousPeriodEnd
  ).length

  const percentageChange = previousCount === 0 
    ? currentCount === 0 ? 0 : 100
    : ((currentCount - previousCount) / previousCount) * 100

  return {
    currentCount,
    previousCount,
    percentageChange: Number(percentageChange.toFixed(1))
  }
}

export const getAnalytics = (
  urls: ShortenedUrl[]
): {
  dailyClicks: DailyClick[];
  deviceStats: DeviceStat[];
} => {
  // Flatten all clicks from all URLs
  const allClicks = urls.flatMap((url) => url.clicks);

  // Process daily clicks
  const dailyClicksMap = allClicks.reduce((acc, click) => {
    const date = new Date(click.clickedAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dailyClicks = Object.entries(dailyClicksMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Process device stats using userAgent from clicks
  const deviceStatsMap = allClicks.reduce((acc, click) => {
    const parser = new UAParser(click.userAgent);
    const deviceType = parser.getDevice().type || "desktop";
    acc[deviceType] = (acc[deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceStats = Object.entries(deviceStatsMap)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
    .sort((a, b) => b.value - a.value);

  return { dailyClicks, deviceStats };
};

export const getRecentItems = <T extends { createdAt: string }>(
  items: T[],
  count: number = 5
): T[] => {
  return items.slice(0, count); 
};
