// Auth

export type User = {
  id: string;
  email: string;
  fullName: string;
};

export type AuthState = {
  isAuthorized: boolean;
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
};

// QR Codes

export interface Scan {
  id: string;
  qrCodeId: string;
  shortUrl: string;
  ipAddress: string;
  userAgent: string;
  referer: string | null;
  scannedAt: string;
}

export interface QRCode {
  id: string;
  userId: string;
  name: string;
  originalUrl: string;
  shortUrl: string;
  scans: Scan[];
  scanCount: number;
  lastScan: string;
  modifiedAt: string;
  createdAt: string;
}

// Shorthened URLs

export interface Clicks {
  id: string;
  shortenedUrlId: string;
  shortUrl: string;
  ipAddress: string;
  userAgent: string;
  referer: string | null;
  clickedAt: string;
}

export interface ShortenedUrl {
  id: string;
  userId: string;
  name: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  modifiedAt: string;
  clicks: Clicks[];
  clickCount: number;
  lastClick: string | null;
}

// Search Bar

export type SearchBarProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
};

// Dashboard
export interface DashboardStats {
  totalURLs: number;
  totalClicks: number;
  totalQRs: number;
  totalScans: number;
  recentClicks: number;
  recentScans: number;
  urlGrowth: number;
  qrGrowth: number;
  user: {
    name: string;
    email: string;
    userId: string;
  };
}

export interface GrowthStats {
  currentCount: number;
  previousCount: number;
  percentageChange: number;
}

export interface DailyClick {
  date: string;
  count: number;
}

export interface DeviceStat {
  name: string;
  value: number;
}

// Analytics
export interface QRCodeAnalyticsSummary {
  totalScans: number;
  uniqueVisitors: number;
  mostPopularBrowser: string;
  mostPopularOS: string;
  mobilePercentage: number;
  busiestHour: string;
  mostCommonReferrer: string;
}

export interface EnhancedScan {
  id: string;
  scannedAt: Date;
  ipAddress: string;
  browser: string;
  os: string;
  deviceType: string;
  isMobile: boolean;
  timeOfDay: string;
  referer: string;
}

export interface TotalClicksCardProps {
  dailyClicks: { date: string; count: number }[];
  totalClicks: number;
}

export interface URLAnalyticsData {
  url: {
    id: string;
    name: string;
    shortUrl: string;
    originalUrl: string;
    createdAt: string;
  };
  totalClicks: number;
  dailyClicks: { date: string; count: number }[];
  browserStats: { browser: string; count: number }[];
  referrerStats: { referrer: string; count: number }[];
}
