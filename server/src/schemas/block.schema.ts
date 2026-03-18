import { z } from "zod"

export const createBlockSchema = z.object({
  type: z.enum(["link", "text", "image", "video", "paid_post", "locked"]),
  content: z.record(z.any())
})

export const updateBlockSchema = z.object({
  content: z.record(z.any()).optional(),
  visible: z.boolean().optional()
})

export const reorderBlocksSchema = z.object({
  order: z.array(z.string())
})