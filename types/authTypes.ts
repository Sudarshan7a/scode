import { z } from "zod";
import {
  allowedEmailDomains,
  isEmailDomainAllowed,
} from "@/types/mogodbValidation";

export const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and number"
  );

// Login form schema
export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address." }),
  password: strongPassword,
});

// Signup form schema
export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, { message: "Username must be at least 2 characters." }),
    email: z
      .string()
      .trim()
      .email({ message: "Invalid email address." })
      .refine((val) => isEmailDomainAllowed(val), {
        message: `We only support these domains: ${allowedEmailDomains.join(
          ", "
        )}`,
      }),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Type exports
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

// Auth form props interfaces
export interface EmailPasswordFormProps {
  onSubmit: (values: LoginFormValues) => void;
  buttonText: string;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
}

export interface SignupEmailPasswordFormProps {
  onSubmit: (values: SignupFormValues) => Promise<{
    ok: boolean;
    message?: string;
    fieldErrors?: Partial<Record<keyof SignupFormValues | "root", string>>;
    redirect?: string;
  }>;
  buttonText: string;
}
