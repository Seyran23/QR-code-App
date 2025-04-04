// app/dashboard/urls/create/page.tsx
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
import { createshorthenedURLSchema } from "@/schemas";
import { createShorthenedURL } from "@/actions/url-actions";

const CreateShortenedURL = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createshorthenedURLSchema>>({
    resolver: zodResolver(createshorthenedURLSchema),
    defaultValues: {
      name: "",
      originalUrl: "",
    },
  });

  const formSubmitHandler = async (
    values: z.infer<typeof createshorthenedURLSchema>
  ) => {
    try {
      const result = await createShorthenedURL({
        name: values.name,
        originalUrl: values.originalUrl,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.success && result.shorthenedUrl) {
        toast.success("QR Code created successfully!");
        const cleanShortUrl = result.shorthenedUrl.shortUrl.replace(/^v\//, "");

        router.push(`/dashboard/urls/${cleanShortUrl}`);
      }

      form.reset();
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Shorthened URL</h1>

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
                <FormLabel>Shorthened URL Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="My Shorthened URL"
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
            Create Shorthened URL
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateShortenedURL;
