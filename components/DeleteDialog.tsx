// app/dashboard/components/DeleteDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteQRCode } from "@/actions/qrcode-actions";

const DeleteDialog = ({
  item, 
  itemId,
  mutate,
}: {
  item: string;
  itemId: string;
  mutate: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
       toast.promise(deleteQRCode(itemId), {
        loading: `Deleting ${item}...`,
        success: `${item} deleted successfully!`,
        error: (error) => error.message || `Failed to delete ${item}`,
      });
      mutate();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {item}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to delete this {item}?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
