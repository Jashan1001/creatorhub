import { useBuilder } from "../builder/BuilderContext";
import type { Block } from "../builder/BuilderContext";
import { Input } from "@/components/ui/input";

const SOCIAL_PLATFORMS = ["twitter", "instagram", "youtube", "tiktok", "github", "linkedin"] as const;

export function SocialBlock({ block }: { block: Block }) {
  const { updateBlock } = useBuilder();
  const content = block.content || {};

  return (
    <div className="flex flex-col gap-3">
      <select
        value={(content.platform as string) || "twitter"}
        onChange={(e) => updateBlock(block._id, { ...content, platform: e.target.value })}
        className="h-10 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
      >
        {SOCIAL_PLATFORMS.map((platform) => (
          <option key={platform} value={platform}>
            {platform[0].toUpperCase() + platform.slice(1)}
          </option>
        ))}
      </select>
      <Input
        placeholder="Handle (without @)"
        value={(content.handle as string) || ""}
        onChange={(e) => updateBlock(block._id, { ...content, handle: e.target.value.trim() })}
        className="bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
      />
    </div>
  );
}
