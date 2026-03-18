import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional()
})

export const updateThemeSchema = z.object({
  theme: z.enum(["minimal", "dark", "gradient"])
})