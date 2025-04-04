// components/url-analytics/UrlInfoCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface UrlInfoCardProps {
  url?: {
    name?: string;
    shortUrl?: string;
    originalUrl?: string;
    createdAt?: string;
  };
}

export function UrlInfoCard({ url }: UrlInfoCardProps) {
  if (!url) {
    return (
      <Card>
        <CardContent className="text-muted-foreground">
          URL information not available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{url.name || "Unnamed URL"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong>Original URL:</strong>{" "}
          <a
            href={url.originalUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline break-all"
          >
            {url.originalUrl || "N/A"}
          </a>
        </div>
        
        <div>
          <strong>Shortened URL:</strong>{" "}
          <span className="text-green-600">
            /{url.shortUrl || "invalid-short-url"}
          </span>
        </div>
        
        <div>
          <strong>Created At:</strong>{" "}
          {url.createdAt ? format(new Date(url.createdAt), "PPP") : "Unknown date"}
        </div>
      </CardContent>
    </Card>
  );
}