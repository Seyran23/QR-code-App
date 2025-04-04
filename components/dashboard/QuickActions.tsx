import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Link2, QrCode } from "lucide-react";

// components/dashboard/quick-actions.tsx
const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card className="hover:bg-accent transition-colors">
        <Link href="/dashboard/urls/create">
          <CardContent className="p-6 flex items-center gap-4">
            <Link2 className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Create New Short URL</h3>
              <p className="text-sm text-muted-foreground">
                Generate a new shortened link
              </p>
            </div>
          </CardContent>
        </Link>
      </Card>

      <Card className="hover:bg-accent transition-colors">
        <Link href="/dashboard/qr-codes/create">
          <CardContent className="p-6 flex items-center gap-4">
            <QrCode className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Generate QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Create a new QR code for any URL
              </p>
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
};

export default QuickActions;
