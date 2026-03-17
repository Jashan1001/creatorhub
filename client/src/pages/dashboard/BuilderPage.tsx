import { BuilderProvider } from "@/components/builder/BuilderContext";
import { AddBlockMenu } from "@/components/builder/AddBlockMenu";
import { BlockList } from "@/components/builder/BlockList";
import { PreviewPanel } from "@/components/builder/PreviewPanel";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BuilderPage() {
  const { user } = useAuth();
  
  return (
    <BuilderProvider>
      <div className="fixed inset-0 top-16 lg:left-64 flex flex-col md:flex-row bg-[var(--bg-base)] overflow-hidden font-body text-[var(--text-primary)]">
        
        {/* Left Panel: Builder Controls (Fixed Width) */}
        <div className="w-full md:w-[420px] shrink-0 border-r border-[var(--border)] flex flex-col h-full bg-[var(--bg-surface)]">
          
          <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-surface)] shrink-0">
            <h1 className="font-display text-xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Editor</h1>
            <a
              href={`/${user?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] bg-[var(--accent-muted)] px-3 py-1.5 rounded-md transition-colors shadow-sm"
            >
              creatorhub.co/@{user?.username}
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <AddBlockMenu />
            
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Your Blocks</h3>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-4">Drag and drop to reorder</p>
              <BlockList />
            </div>
          </div>
          
        </div>

        {/* Right Panel: Live Preview */}
        <PreviewPanel />
      </div>
    </BuilderProvider>
  );
}
