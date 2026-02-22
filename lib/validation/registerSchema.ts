import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters")
    .regex(/^[A-Za-z\s]+$/, "Name cannot contain numbers or symbols")
    .refine((val) => val.trim().length > 0, "Name is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/i,
      "Email must end with .com"
    ),

  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[a-z]/, "Must include lowercase letter")
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[0-9]/, "Must include number")
    .regex(/^\S+$/, "Password cannot contain spaces"),
});