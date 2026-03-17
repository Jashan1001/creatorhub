import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export type BlockType = "link" | "text" | "image" | "video" | "header" | "social" | "divider" | "paid_post";

export interface Block {
  _id: string;
  type: BlockType;
  position: number;
  content: any;
}

interface BuilderContextType {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  loading: boolean;
  addBlock: (type: BlockType) => Promise<void>;
  updateBlock: (id: string, content: any) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  reorderBlocks: (newBlocks: Block[]) => Promise<void>;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const { data } = await api.get("/blocks");
      // Sort blocks by position just in case
      setBlocks(data.sort((a: Block, b: Block) => a.position - b.position));
    } catch (err) {
      toast.error("Failed to load blocks");
    } finally {
      setLoading(false);
    }
  };

  const addBlock = async (type: BlockType) => {
    try {
      const { data } = await api.post("/blocks", {
        type,
        position: blocks.length,
        content: {}, // Default empty content
      });
      setBlocks((prev) => [...prev, data]);
      toast.success(`${type} block added`);
    } catch (err) {
      toast.error("Failed to add block");
      throw err;
    }
  };

  const updateBlock = async (id: string, content: any) => {
    // Optimistic update
    setBlocks((prev) =>
      prev.map((b) => (b._id === id ? { ...b, content } : b))
    );

    try {
      await api.put(`/blocks/${id}`, { content });
    } catch (err) {
      toast.error("Failed to save changes");
      // Revert on failure by refetching
      fetchBlocks();
    }
  };

  const deleteBlock = async (id: string) => {
    // Optimistic delete
    setBlocks((prev) => prev.filter((b) => b._id !== id));

    try {
      await api.delete(`/blocks/${id}`);
      toast.success("Block deleted");
    } catch (err) {
      toast.error("Failed to delete block");
      fetchBlocks();
    }
  };

  const reorderBlocks = async (newBlocks: Block[]) => {
    setBlocks(newBlocks);

    try {
      const updates = newBlocks.map((b, index) => ({
        id: b._id,
        position: index,
      }));
      await api.put("/blocks/reorder", { blocks: updates });
    } catch (err) {
      toast.error("Failed to save new order");
      fetchBlocks();
    }
  };

  return (
    <BuilderContext.Provider
      value={{
        blocks,
        setBlocks,
        loading,
        addBlock,
        updateBlock,
        deleteBlock,
        reorderBlocks,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}
