import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(40, "Name is too long")
      .regex(/^[A-Za-z ]+$/, "Only letters and spaces are allowed"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password cannot exceed 32 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
        "Password must include uppercase, lowercase, number and special character."
      ),

    confirmPassword: z.string(),

    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms & Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type SignupFormValues = z.infer<typeof signupSchema>;