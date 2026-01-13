import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  fullname: z.string().min(1).max(255),
  password: z.string().min(8).max(255),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
