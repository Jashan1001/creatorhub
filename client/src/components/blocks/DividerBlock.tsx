import { useBuilder } from "../builder/BuilderContext";
import type { Block } from "../builder/BuilderContext";

export function DividerBlock({ block }: { block: Block }) {
  const { updateBlock } = useBuilder();
  const content = block.content || {};

  return (
    <div className="flex flex-col gap-3">
      <div className="h-px bg-[var(--border-strong)] w-full" />
      <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
        <input
          type="checkbox"
          checked={Boolean(content.spaced)}
          onChange={(e) => updateBlock(block._id, { ...content, spaced: e.target.checked })}
          className="accent-[var(--accent)]"
        />
        Extra vertical spacing
      </label>
    </div>
  );
}
