import { useState } from "react";
import type { ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Type,
  Image,
  Video,
  Lock,
  GripVertical,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useBlocks } from "@/hooks/useBlocks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/Badge";
import type { Block } from "@/types";

const BLOCK_TYPES = [
  { type: "link", icon: Link2, label: "Link", desc: "A clickable link button" },
  { type: "text", icon: Type, label: "Text", desc: "A paragraph of text" },
  { type: "image", icon: Image, label: "Image", desc: "An image with optional caption" },
  { type: "video", icon: Video, label: "Video", desc: "A YouTube or Vimeo embed" },
  { type: "paid_post", icon: Lock, label: "Paid post", desc: "Content locked behind a tier" },
] as const;

const BlockIcon = ({ type }: { type: string }) => {
  const icons: Record<string, ReactNode> = {
    link: <Link2 size={14} />,
    text: <Type size={14} />,
    image: <Image size={14} />,
    video: <Video size={14} />,
    paid_post: <Lock size={14} />,
  };
  return <>{icons[type] ?? <Link2 size={14} />}</>;
};

const BlockEditor = ({
  block,
  onUpdate,
}: {
  block: Block;
  onUpdate: (id: string, data: Partial<Block>) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState(block.content);

  const save = () => {
    onUpdate(block._id, { content });
    setExpanded(false);
    toast.success("Block saved");
  };

  const cancel = () => {
    setContent(block.content);
    setExpanded(false);
  };

  const c = (key: string, val: string) => setContent((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="flex-1 min-w-0">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left flex items-center gap-2">
        <span className="text-sm font-medium text-(--text-primary) truncate">
          {block.type === "link" && ((content.title as string) || "Untitled link")}
          {block.type === "text" && ((content.text as string)?.slice(0, 40) || "Empty text")}
          {block.type === "image" && "Image block"}
          {block.type === "video" && "Video block"}
          {block.type === "paid_post" && ((content.title as string) || "Paid post")}
        </span>
        {block.tier === "paid" && <Badge variant="accent">Paid</Badge>}
        {!block.visible && <Badge variant="default">Hidden</Badge>}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-3 flex flex-col gap-3"
          >
            {block.type === "link" && (
              <>
                <Input label="Title" placeholder="My Twitter" value={(content.title as string) ?? ""} onChange={(e) => c("title", e.target.value)} />
                <Input label="URL" placeholder="https://twitter.com/..." value={(content.url as string) ?? ""} onChange={(e) => c("url", e.target.value)} />
              </>
            )}

            {block.type === "text" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-(--text-secondary)">Text</label>
                <textarea
                  value={(content.text as string) ?? ""}
                  onChange={(e) => c("text", e.target.value)}
                  rows={3}
                  placeholder="Write something..."
                  className="w-full px-3 py-2.5 text-sm resize-none bg-(--bg-elevated) text-(--text-primary) border border-(--border) rounded-md placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition-all"
                />
              </div>
            )}

            {block.type === "image" && (
              <>
                <Input label="Image URL" placeholder="https://..." value={(content.url as string) ?? ""} onChange={(e) => c("url", e.target.value)} />
                <Input label="Caption (optional)" placeholder="Photo by..." value={(content.caption as string) ?? ""} onChange={(e) => c("caption", e.target.value)} />
              </>
            )}

            {block.type === "video" && (
              <Input label="YouTube / Vimeo URL" placeholder="https://youtube.com/watch?v=..." value={(content.url as string) ?? ""} onChange={(e) => c("url", e.target.value)} />
            )}

            {block.type === "paid_post" && (
              <>
                <Input label="Title" placeholder="Exclusive post title" value={(content.title as string) ?? ""} onChange={(e) => c("title", e.target.value)} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-(--text-secondary)">Content</label>
                  <textarea
                    value={(content.text as string) ?? ""}
                    onChange={(e) => c("text", e.target.value)}
                    rows={4}
                    placeholder="This content is only visible to subscribers..."
                    className="w-full px-3 py-2.5 text-sm resize-none bg-(--bg-elevated) text-(--text-primary) border border-(--border) rounded-md placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20"
                  />
                </div>
              </>
            )}

            {block.type !== "paid_post" && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-(--text-secondary)">Gate behind subscription</label>
                <button
                  type="button"
                  onClick={() => onUpdate(block._id, { tier: block.tier === "paid" ? "free" : "paid" })}
                  className={`w-9 h-5 rounded-full transition-all duration-200 relative ${block.tier === "paid" ? "bg-accent" : "bg-(--bg-elevated) border border-(--border)"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${block.tier === "paid" ? "left-4" : "left-0.5"}`} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={save}><Check size={12} /> Save</Button>
              <Button size="sm" variant="ghost" onClick={cancel}><X size={12} /> Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SortableBlock = ({
  block,
  onUpdate,
  onDelete,
}: {
  block: Block;
  onUpdate: (id: string, data: Partial<Block>) => void;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`flex items-start gap-3 transition-all ${isDragging ? "shadow-lg border-(--accent-border)" : ""}`}>
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-(--text-muted) hover:text-(--text-secondary) cursor-grab active:cursor-grabbing touch-none shrink-0"
        >
          <GripVertical size={16} />
        </button>

        <div className="w-7 h-7 rounded-md bg-(--bg-elevated) flex items-center justify-center text-(--text-muted) shrink-0 mt-0.5">
          <BlockIcon type={block.type} />
        </div>

        <BlockEditor block={block} onUpdate={onUpdate} />

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onUpdate(block._id, { visible: !block.visible })}
            className="p-1.5 rounded-md text-(--text-muted) hover:text-(--text-secondary) hover:bg-(--bg-elevated) transition-all"
            title={block.visible ? "Hide block" : "Show block"}
          >
            {block.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={() => {
              if (confirm("Delete this block?")) onDelete(block._id);
            }}
            className="p-1.5 rounded-md text-(--text-muted) hover:text-(--danger) hover:bg-(--danger)/5 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default function BuilderPage() {
  const { user } = useAuth();
  const { blocks, loading, createBlock, updateBlock, deleteBlock, reorder } = useBlocks();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b._id === active.id);
    const newIndex = blocks.findIndex((b) => b._id === over.id);
    reorder(arrayMove(blocks, oldIndex, newIndex));
  };

  const handleAdd = async (type: Block["type"]) => {
    setShowAddMenu(false);
    const defaults: Record<string, Record<string, unknown>> = {
      link: { title: "", url: "" },
      text: { text: "" },
      image: { url: "", caption: "" },
      video: { url: "" },
      paid_post: { title: "", text: "" },
    };
    const created = await createBlock(type, defaults[type] ?? {});
    if (type === "paid_post" && created) {
      await updateBlock(created._id, { tier: "paid" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">Builder</h1>
          <p className="text-sm text-(--text-secondary) mt-1">Drag to reorder · click a block to edit</p>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              <ExternalLink size={14} />
              Preview page
            </a>
          )}
          <div className="relative">
            <Button onClick={() => setShowAddMenu(!showAddMenu)}>
              <Plus size={16} />
              Add block
            </Button>

            <AnimatePresence>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 z-50 bg-(--bg-elevated) border border-(--border) rounded-lg shadow-(--shadow-lg) overflow-hidden"
                >
                  {BLOCK_TYPES.map(({ type, icon: Icon, label, desc }) => (
                    <button
                      key={type}
                      onClick={() => handleAdd(type as Block["type"])}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-(--bg-hover) transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-md bg-(--bg-surface) flex items-center justify-center text-(--text-muted) shrink-0 mt-0.5">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-(--text-primary)">{label}</p>
                        <p className="text-xs text-(--text-muted)">{desc}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : blocks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-12 h-12 rounded-xl bg-(--bg-elevated) flex items-center justify-center">
            <Plus size={20} className="text-(--text-muted)" />
          </div>
          <p className="text-(--text-secondary) text-sm font-medium">No blocks yet</p>
          <p className="text-(--text-muted) text-xs">Click "Add block" to build your page</p>
        </Card>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b._id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {blocks.map((block) => (
                  <motion.div
                    key={block._id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <SortableBlock block={block} onUpdate={updateBlock} onDelete={deleteBlock} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {blocks.length > 0 && (
        <p className="text-xs text-center text-(--text-muted)">
          {blocks.filter((b) => b.visible).length} visible · {" "}
          {blocks.filter((b) => b.tier === "paid").length} gated · {" "}
          {blocks.length} total
        </p>
      )}
    </div>
  );
}

