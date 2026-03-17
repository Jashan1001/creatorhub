import { useBuilder } from "../builder/BuilderContext";
import type { Block } from "../builder/BuilderContext";
import { Input } from "@/components/ui/input";

export function HeaderBlock({ block }: { block: Block }) {
  const { updateBlock } = useBuilder();
  const content = block.content || {};

  return (
    <Input
      placeholder="Section heading"
      value={content.text || ""}
      onChange={(e) => updateBlock(block._id, { ...content, text: e.target.value })}
      className="font-bold bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
    />
  );
}
