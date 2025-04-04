// app/dashboard/qr-codes/create/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createQRCodeSchema } from "@/schemas";
import { createQRCode } from "@/actions/qrcode-actions";

export default function CreateQRCodePage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof createQRCodeSchema>>({
    resolver: zodResolver(createQRCodeSchema),
    defaultValues: {
      name: "",
      originalUrl: "",
    },
  });

  const formSubmitHandler = async (
    values: z.infer<typeof createQRCodeSchema>
  ) => {
    try {
      const result = await createQRCode({
        name: values.name,
        originalUrl: values.originalUrl,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.success && result.qrCode) {
        toast.success("QR Code created successfully!");
        const cleanShortUrl = result.qrCode.shortUrl.replace(/^s\//, "");

        router.push(`/dashboard/qr-codes/${cleanShortUrl}`);
      }

      form.reset();
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New QR Code</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(formSubmitHandler)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>QR Code Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="My QR Code"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="originalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com"
                    type="url"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full cursor-pointer"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Create QR Code
          </Button>
        </form>
      </Form>
    </div>
  );
}
