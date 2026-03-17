import { useBuilder } from "../builder/BuilderContext";
import type { Block } from "../builder/BuilderContext";

export function TextBlock({ block }: { block: Block }) {
  const { updateBlock } = useBuilder();
  const content = block.content || {};

  return (
    <textarea
      placeholder="Type your text here..."
      value={content.text || ""}
      onChange={(e) => updateBlock(block._id, { ...content, text: e.target.value })}
      className="w-full min-h-[100px] p-3 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 resize-y placeholder-[var(--text-muted)] transition-all"
    />
  );
}
