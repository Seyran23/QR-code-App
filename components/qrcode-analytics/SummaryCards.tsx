// components/SummaryCards.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QRCodeAnalyticsSummary } from "@/types";

export const SummaryCards = ({ summary }: { summary: QRCodeAnalyticsSummary }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Total Scans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{summary.totalScans}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Unique Visitors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{summary.uniqueVisitors}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Mobile Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {summary.mobilePercentage.toFixed(1)}%
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Top Referrer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{summary.mostCommonReferrer}</div>
      </CardContent>
    </Card>
  </div>
);
