"use client";
import { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react"; 
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { registerAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuthStore();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const formSubmitHandler = async (values: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    try {
      const { email, password, fullName } = values;
      const result = await registerAction(email, password, fullName);

      if (result.success && result.user) {
        setAuth(result.user);
        toast.success("You registered successfully!")
        router.push("/dashboard");
      } else {
        form.setError("root", {
          message: result.error || "Registration failed",
        });
        toast.error(result.error)
      }

      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col gap-10 shadow-xl py-15 px-30 rounded-2xl">
      <p className="text-4xl text-center font-medium">Register</p>
      <Form key={2} {...form}>
        <form
          onSubmit={form.handleSubmit(formSubmitHandler)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="w-[300px]">
                <FormLabel className="text-xl">Fullname</FormLabel>
                <FormControl>
                  <Input placeholder="Write your email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-[300px]">
                <FormLabel className="text-xl">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Write your email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-[300px]">
                <FormLabel className="text-xl">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Write your password..."
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="cursor-pointer" size={20} />
                      ) : (
                        <Eye className="cursor-pointer" size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="cursor-pointer w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-gray-600">
        You have an account already then{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          login
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
