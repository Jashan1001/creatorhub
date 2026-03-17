import { useBuilder } from "./BuilderContext";
import type { Block } from "./BuilderContext";

export function PreviewPanel() {
  const { blocks, loading } = useBuilder();

  // Simple rendering of blocks for the preview
  const renderPreviewBlock = (block: Block) => {
    switch (block.type) {
      case "link":
        return (
          <a
            key={block._id}
            href={block.content?.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border)] rounded-xl text-center text-sm font-bold transition-all shadow-sm mb-3"
          >
            {block.content?.title || "Link Title"}
          </a>
        );
      case "text":
        return (
          <p key={block._id} className="text-[var(--text-primary)] text-sm mb-4 leading-relaxed whitespace-pre-wrap px-2 font-semibold">
            {block.content?.text || "Your text here..."}
          </p>
        );
      case "image":
        return block.content?.url ? (
          <img
            key={block._id}
            src={block.content.url}
            alt="Preview"
            className="w-full rounded-xl mb-4 object-cover shadow-sm"
          />
        ) : null;
      case "video":
        // Simple mock for iframe - in reality you'd want to parse the URL and handle different providers
        return block.content?.url ? (
          <div key={block._id} className="w-full aspect-video bg-[var(--bg-base)] border border-[var(--border)] rounded-xl mb-4 flex items-center justify-center text-[var(--text-secondary)] font-semibold text-xs shadow-inner">
            Video Embed: {block.content.url}
          </div>
        ) : null;
      case "header":
        return (
          <h3 key={block._id} className="text-base font-black text-[var(--text-primary)] tracking-tight text-center my-2 px-2">
            {block.content?.text || "Section heading"}
          </h3>
        );
      case "social": {
        const platform = (block.content?.platform as string) || "social";
        const handle = (block.content?.handle as string) || "handle";
        return (
          <div
            key={block._id}
            className="block w-full py-3 px-4 bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] rounded-xl text-center text-sm font-bold shadow-sm mb-3"
          >
            {platform[0].toUpperCase() + platform.slice(1)} @{handle}
          </div>
        );
      }
      case "divider":
        return (
          <div key={block._id} className={`w-full border-t border-[var(--border-strong)] ${block.content?.spaced ? "my-6" : "my-3"}`} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-[1] bg-[var(--bg-surface)] flex items-center justify-center overflow-y-auto p-8 border-l border-[var(--border)] w-full">
      {/* Mobile Phone outline */}
      <div className="w-[340px] h-[720px] bg-[var(--bg-base)] rounded-[40px] shadow-[var(--shadow-lg)] overflow-hidden border-[8px] border-[var(--text-primary)] relative flex flex-col font-body ring-4 ring-[var(--border-subtle)]">
        {/* Fake notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[var(--text-primary)] rounded-b-xl z-20" />

        {/* Header/Bio area */}
        <div className="pt-16 pb-6 px-6 text-center shrink-0">
          <div className="w-20 h-20 bg-[var(--bg-surface)] border-2 border-[var(--accent)] rounded-full mx-auto mb-3 shadow-md" />
          <h2 className="font-display font-black text-xl text-[var(--text-primary)] tracking-tight">Your Name</h2>
          <p className="text-sm font-bold text-[var(--text-secondary)] mt-1 tracking-wide">@username</p>
        </div>

        {/* Scrollable blocks area */}
        <div className="flex-1 overflow-y-auto px-5 pb-10 scrollbar-hide">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-[var(--bg-elevated)] rounded-xl" />
              <div className="h-12 bg-[var(--bg-elevated)] rounded-xl" />
            </div>
          ) : blocks.length === 0 ? (
            <p className="text-center text-[var(--text-muted)] font-semibold text-sm mt-10">
              Add blocks to see them here
            </p>
          ) : (
            blocks.map(renderPreviewBlock)
          )}
        </div>
      </div>
    </div>
  );
}
