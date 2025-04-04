// app/dashboard/qr-codes/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import SkeletonRow from "@/components/SkeletonRow";

import useSWR from "swr";
import { getAccessToken } from "@/actions/auth-actions";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { QrCode } from "lucide-react";
import { QRCode } from "@/types";

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

const useQRCodes = (page: number, limit: number) => {
  const { data, error, mutate, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/qr-codes?page=${page}&limit=${limit}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return {
    qrCodes: data || [],
    pagination: data?.pagination || { totalPages: 1 },
    isLoading,
    isError: error,
    mutate,
  };
};

export default function AllQRCodes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { qrCodes, pagination, isLoading, isError, mutate } = useQRCodes(
    currentPage,
    itemsPerPage
  );

  const filteredQrCodes = qrCodes.filter((qr: QRCode) =>
    qr.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isError) {
    console.error(isError);
    return null;
  }

  const displayPageCount = searchQuery
    ? Math.ceil(filteredQrCodes.length / itemsPerPage)
    : pagination.totalPages;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <QrCode size={25} /> All QR Codes
        </h1>
        <Button asChild>
          <Link href="/dashboard/qr-codes/create">Create QR Code</Link>
        </Button>
      </div>

      <SearchBar
        placeholder="Search by QR code name..."
        onSearch={setSearchQuery}
        className="max-w-md"
      />

      <div className="p-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>QR Code Name</TableHead>
              <TableHead className="text-center">Scan Count</TableHead>
              <TableHead className="hidden md:table-cell">
                Last Scanned
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Created Date
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => <SkeletonRow key={i} />)
              : filteredQrCodes
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((qr: QRCode) => (
                    <TableRow key={qr.id}>
                      <TableCell className="font-medium">{qr.name}</TableCell>
                      <TableCell className="text-center">
                        {qr.scanCount}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {qr.lastScan
                          ? new Date(qr.lastScan).toLocaleDateString()
                          : "Never Scanned"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(qr.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/qr-codes/${qr.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/dashboard/qr-codes/${qr.id}/analytics`}>
                            <Button variant="ghost" size="sm">
                              Scan Analytics
                            </Button>
                          </Link>
                          <EditDialog
                            item="QR Code"
                            itemData={qr}
                            mutate={mutate}
                          />
                          <DeleteDialog
                            item="QR Code"
                            itemId={qr.id}
                            mutate={mutate}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>

        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                isActive={currentPage > 1}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {displayPageCount}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage(Math.min(displayPageCount, currentPage + 1))
                }
                isActive={currentPage < displayPageCount}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
