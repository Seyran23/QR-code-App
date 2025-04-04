// components/ScanTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EnhancedScan } from "@/types";
import { format } from "date-fns";

export const ScanTable = ({ scans }: { scans: EnhancedScan[] }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Scan History</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Browser</TableHead>
            <TableHead>OS</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Referrer Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scans.map((scan) => (
            <TableRow key={scan.id}>
              <TableCell>{format(scan.scannedAt, "dd MMM, HH:mm")}</TableCell>
              <TableCell>{scan.deviceType}</TableCell>
              <TableCell>{scan.browser}</TableCell>
              <TableCell>{scan.os}</TableCell>
              <TableCell>{scan.ipAddress}</TableCell>
              <TableCell>{scan.referer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
