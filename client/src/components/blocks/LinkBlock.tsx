import { useBuilder } from "../builder/BuilderContext";
import type { Block } from "../builder/BuilderContext";
import { Input } from "@/components/ui/input";

export function LinkBlock({ block }: { block: Block }) {
  const { updateBlock } = useBuilder();
  const content = block.content || {};

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Title"
        value={content.title || ""}
        onChange={(e) => updateBlock(block._id, { ...content, title: e.target.value })}
        className="font-bold bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
      />
      <Input
        placeholder="URL"
        type="url"
        value={content.url || ""}
        onChange={(e) => updateBlock(block._id, { ...content, url: e.target.value })}
        className="text-[var(--text-secondary)] font-medium bg-[var(--bg-surface)] border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
      />
    </div>
  );
}
