import * as z from "zod";
export const signupValidation = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters." }),
});
export const loginValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters." }),
});
