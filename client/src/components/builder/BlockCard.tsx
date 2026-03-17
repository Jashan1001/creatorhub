import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import type { Block } from "./BuilderContext";
import { LinkBlock } from "../blocks/LinkBlock";
import { TextBlock } from "../blocks/TextBlock";
import { ImageBlock } from "../blocks/ImageBlock";
import { VideoBlock } from "../blocks/VideoBlock";
import { HeaderBlock } from "../blocks/HeaderBlock";
import { SocialBlock } from "../blocks/SocialBlock";
import { DividerBlock } from "../blocks/DividerBlock";

export function BlockCard({ block }: { block: Block }) {
  const { deleteBlock } = useBuilder();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderContent = () => {
    switch (block.type) {
      case "link": return <LinkBlock block={block} />;
      case "text": return <TextBlock block={block} />;
      case "image": return <ImageBlock block={block} />;
      case "video": return <VideoBlock block={block} />;
      case "header": return <HeaderBlock block={block} />;
      case "social": return <SocialBlock block={block} />;
      case "divider": return <DividerBlock block={block} />;
      default: return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)] overflow-hidden group hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] transition-all relative"
    >
      <div className="bg-[var(--bg-base)] border-b border-[var(--border-subtle)] px-3 py-2 flex items-center justify-between">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center gap-2 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <GripVertical size={16} />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {block.type}
          </span>
        </div>

        <button
          onClick={() => deleteBlock(block._id)}
          className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-1 opacity-0 group-hover:opacity-100"
          title="Delete block"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
}
