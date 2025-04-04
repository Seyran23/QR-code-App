// components/url-analytics/ReferrerStatsTable.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ReferrerStatsTableProps {
  referrerStats: { referrer: string; count: number }[];
}

export function ReferrerStatsTable({ referrerStats }: ReferrerStatsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referrer Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referrer</TableHead>
              <TableHead>Clicks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrerStats.map((ref) => (
              <TableRow key={ref.referrer}>
                <TableCell>{ref.referrer}</TableCell>
                <TableCell>{ref.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
