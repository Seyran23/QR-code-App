// app/components/EditDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { updateQRCode } from "@/actions/qrcode-actions";
import { editFormSchema } from "@/schemas";
import { updateShorthenedURL } from "@/actions/url-actions";

type EditFormValues = z.infer<typeof editFormSchema>;

const EditDialog = ({
  itemData,
  item,
  mutate,
}: {
  itemData: any;
  item: string;
  mutate: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: itemData.name,
      originalUrl: itemData.originalUrl,
    },
  });

  const handleSubmit = (values: EditFormValues) => {
    try {
      let updateFunction;

      if (item === "QR Code") {
        updateFunction = updateQRCode;
      } else if (item === "Shorthened URL") {
        updateFunction = updateShorthenedURL;
      } else {
        throw new Error("Invalid item type");
      }

      toast.promise(updateFunction(itemData.id, values), {
        loading: `Updating ${item}...`,
        success: `${item} updated successfully!`,
        error: (error) => error.message || `Failed to update ${item}`,
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
        <Button variant="ghost" size="sm" >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {item}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              {...form.register("name")}
              id="name"
              placeholder={`${item} Name`}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalUrl">Original URL</Label>
            <Input
              {...form.register("originalUrl")}
              id="originalUrl"
              placeholder="https://example.com"
              type="url"
            />
            {form.formState.errors.originalUrl && (
              <p className="text-sm text-red-500">
                {form.formState.errors.originalUrl.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
