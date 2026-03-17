import { z } from "zod";

// Auth
export const signupSchema = z.object({
  name: z.string().min(2).max(50),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

// Blocks
export const createBlockSchema = z.object({
  type: z.enum(["link", "text", "image", "video", "header", "social", "divider", "paid_post"]),
  content: z.record(z.unknown()).default({}),
  position: z.number().int().min(0).default(0),
  tier: z.enum(["free", "paid"]).default("free"),
});

export const updateBlockSchema = z.object({
  type: z.enum(["link", "text", "image", "video", "header", "social", "divider", "paid_post"]).optional(),
  content: z.record(z.unknown()).optional(),
  position: z.number().int().min(0).optional(),
  visible: z.boolean().optional(),
  tier: z.enum(["free", "paid"]).optional(),
});

export const reorderBlocksSchema = z.object({
  blocks: z.array(
    z.object({
      id: z.string(),
      position: z.number().int().min(0),
    })
  ),
});

// User / Profile
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(200).optional(),
  theme: z.enum(["minimal", "dark", "gradient"]).optional(),
});

export const updateThemeSchema = z.object({
  theme: z.enum(["minimal", "dark", "gradient"]),
});
