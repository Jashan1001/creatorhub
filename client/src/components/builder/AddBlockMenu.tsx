import { Type, Link as LinkIcon, Image, Video, Heading, Share2, Minus } from "lucide-react";
import { useBuilder } from "./BuilderContext";

const AVAILABLE_BLOCKS = [
  { type: "link", label: "Link", icon: LinkIcon },
  { type: "text", label: "Text", icon: Type },
  { type: "image", label: "Image", icon: Image },
  { type: "video", label: "Video", icon: Video },
  { type: "header", label: "Header", icon: Heading },
  { type: "social", label: "Social", icon: Share2 },
  { type: "divider", label: "Divider", icon: Minus },
] as const;

export function AddBlockMenu() {
  const { addBlock } = useBuilder();

  const handleAdd = (type: (typeof AVAILABLE_BLOCKS)[number]["type"]) => {
    addBlock(type);
  };

  return (
    <div className="bg-[var(--bg-base)] rounded-xl shadow-[var(--shadow-sm)] border border-[var(--border)] p-5 mb-6">
      <h3 className="font-display text-sm font-bold text-[var(--text-primary)] mb-3">Add Block</h3>
      <div className="grid grid-cols-4 gap-3">
        {AVAILABLE_BLOCKS.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => handleAdd(type)}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] transition-all relative group shadow-sm"
          >
            <Icon size={20} className="mb-2 text-[var(--text-primary)] group-hover:scale-110 transition-transform group-hover:text-[var(--accent)]" />
            <span className="text-[11px] font-bold text-[var(--text-secondary)]">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
