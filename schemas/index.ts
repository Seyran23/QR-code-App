import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[\W_]/, "Password must have at least one special character"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must have at least one uppercase letter")
  .regex(/[\W_]/, "Password must have at least one special character"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

export const createQRCodeSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  originalUrl: z.string().url("Please input invalid URL")
})

export const createshorthenedURLSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  originalUrl: z.string().url("Please input invalid URL")
})

export const editFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  originalUrl: z.string().url("Valid URL is required"),
});