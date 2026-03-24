import { z } from 'zod';

export const baseAuthSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

export const registerSchema = baseAuthSchema.extend({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
});

export const loginSchema = baseAuthSchema;

export type BaseAuth = z.infer<typeof baseAuthSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

// Response
interface BaseAuthResponse{
  name: string,
  email: string,

}

export type RegisterResponse = BaseAuthResponse

export interface LoginResponse extends BaseAuthResponse{
  role: "admin" | "user"
  access_token: string
  refresh_token: string
}