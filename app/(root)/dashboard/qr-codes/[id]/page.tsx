// app/dashboard/qr-codes/[id]/page.tsx

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { getQRCodeDetailById } from "@/actions/qrcode-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

const QRCodeDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  const qrCode = await getQRCodeDetailById(id);

  if (!qrCode) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{qrCode.name}</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/qr-codes">Back to List</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <QRDisplay qrCode={qrCode} />

        <div className="space-y-4">
          <UrlSection
            label="Original URL"
            url={qrCode.originalUrl}
            displayUrl={qrCode.originalUrl}
          />

          <div className="grid grid-cols-2 gap-4">
            <StatItem
              label="Created At"
              value={format(new Date(qrCode.createdAt), "d MMMM, yyyy - HH:mm")}
            />
            <StatItem
              label="Last Scan"
              value={
                qrCode.lastScan
                  ? format(new Date(qrCode.lastScan), "d MMMM, yyyy - HH:mm")
                  : "Never scanned"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};


const QRDisplay = ({
  qrCode: { shortUrl },
}: {
  qrCode: { shortUrl: string };
}) => (
  <div className="p-4 bg-white rounded-lg shadow-sm">
    <QRCodeSVG
      value={`${process.env.NEXT_PUBLIC_BASE_URL}/s/${shortUrl}`}
      size={256}
      className="mx-auto"
    />
  </div>
);

const UrlSection = ({
  label,
  url,
  displayUrl,
}: {
  label: string;
  url: string;
  displayUrl: string;
}) => (
  <div>
    <h3 className="font-medium mb-1">{label}</h3>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline break-all"
    >
      {displayUrl}
    </a>
  </div>
);

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <h3 className="font-medium">{label}</h3>
    <p className="text-gray-600">{value}</p>
  </div>
);

export default QRCodeDetailPage;
