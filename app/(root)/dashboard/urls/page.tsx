// app/dashboard/urls/page.tsx
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
import { Link2 } from "lucide-react";
import { ShortenedUrl } from "@/types";

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

const useShorthenedURLs = (page: number, limit: number) => {
  const { data, error, mutate, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/urls?page=${page}&limit=${limit}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );


  return {
    shorthenedURLs: data || [],
    pagination: data?.pagination || { totalPages: 1 },
    isLoading,
    isError: error,
    mutate,
  };
};

export default function AllShortenedURLs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { shorthenedURLs, pagination, isLoading, isError, mutate } =
    useShorthenedURLs(currentPage, itemsPerPage);

  const filteredShorthenedURLs = shorthenedURLs.filter((url: ShortenedUrl) =>
    url.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isError) {
    console.error(isError);
    return null;
  }

  const displayPageCount = searchQuery
    ? Math.ceil(filteredShorthenedURLs.length / itemsPerPage)
    : pagination.totalPages;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"> <Link2 size={25} className=" rotate-135" /> All Shortened URLs</h1>
        <Button asChild>
          <Link href="/dashboard/urls/create">Create Shorthened URL</Link>
        </Button>
      </div>

      <SearchBar
        placeholder="Search by shorthened URL name..."
        onSearch={setSearchQuery}
        className="max-w-md"
      />

      <div className="p-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL Name</TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead className="text-center">Click Count</TableHead>
              <TableHead className="hidden md:table-cell">
                Last Clicked
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
              : filteredShorthenedURLs.map((url: ShortenedUrl) => (
                  <TableRow key={url.id}>
                    <TableCell className="font-medium">{url.name}</TableCell>
                    <TableCell>
                      <a
                        href={url.originalUrl}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Go to
                      </a>
                    </TableCell>
                  
                    <TableCell className="text-center">
                      {url.clickCount}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {url.lastClick
                        ? new Date(url.lastClick).toLocaleDateString()
                        : "Never Clicked"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
 
                        <Link href={`/dashboard/urls/${url.id}/analytics`}>
                          <Button variant="ghost" size="sm">
                            Click Analytics
                          </Button>
                        </Link>
                        <EditDialog
                          item="Shorthened URL"
                          itemData={url}
                          mutate={mutate}
                        />
                        <DeleteDialog
                          item="Shorthened URL"
                          itemId={url.id}
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
