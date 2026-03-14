import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Block } from "@/types";

export const useBlocks = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/blocks");
      setBlocks(res.data);
    } catch {
      toast.error("Failed to load blocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createBlock = async (
    type: Block["type"],
    content: Record<string, unknown> = {}
  ) => {
    try {
      const position = blocks.length;
      const res = await api.post("/blocks", { type, content, position, tier: "free" });
      setBlocks((prev) => [...prev, res.data]);
      return res.data as Block;
    } catch {
      toast.error("Failed to create block");
    }
  };

  const updateBlock = async (id: string, data: Partial<Block>) => {
    try {
      const res = await api.put(`/blocks/${id}`, data);
      setBlocks((prev) => prev.map((b) => (b._id === id ? res.data : b)));
    } catch {
      toast.error("Failed to update block");
    }
  };

  const deleteBlock = async (id: string) => {
    try {
      await api.delete(`/blocks/${id}`);
      setBlocks((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast.error("Failed to delete block");
    }
  };

  const reorder = async (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    try {
      await api.put("/blocks/reorder", {
        blocks: newBlocks.map((b, i) => ({ id: b._id, position: i })),
      });
    } catch {
      toast.error("Failed to save order");
      load();
    }
  };

  return { blocks, loading, createBlock, updateBlock, deleteBlock, reorder, reload: load };
};
