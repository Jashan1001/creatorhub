import { z } from "zod";

export const trackEventSchema = z.object({
  type: z.enum(["page_view", "link_click"]),
  creatorId: z.string().min(1),
  blockId: z.string().optional(),
});
