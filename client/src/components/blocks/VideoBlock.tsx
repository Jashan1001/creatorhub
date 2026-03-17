import { useBuilder } from "../builder/BuilderContext";
import type { Block } from "../builder/BuilderContext";
import { Input } from "@/components/ui/input";
import { Video as VideoIcon } from "lucide-react";

export function VideoBlock({ block }: { block: Block }) {
  const { updateBlock } = useBuilder();
  const content = block.content || {};

  return (
    <div className="flex flex-col gap-3">
      {!content.url && (
        <div className="w-full h-24 bg-[var(--bg-base)] rounded-lg flex flex-col items-center justify-center border border-dashed border-[var(--border-strong)] shadow-inner">
          <VideoIcon className="text-[var(--text-muted)] mb-2" />
          <span className="text-xs font-semibold text-[var(--text-secondary)]">Add YouTube or Vimeo URL</span>
        </div>
      )}
      <Input
        placeholder="Video URL"
        type="url"
        value={content.url || ""}
        onChange={(e) => updateBlock(block._id, { ...content, url: e.target.value })}
        className="bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
      />
    </div>
  );
}
