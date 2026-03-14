"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2, GripVertical } from "lucide-react"
import { useBuilder } from "./BuilderContext"

type Block = {
  _id: string
  type: string
  content: any
}

type Props = {
  block: Block
}

export default function BlockCard({ block }: Props) {

  const { blocks, setBlocks } = useBuilder()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: block._id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const updateContent = (field: string, value: string) => {

    const updated = blocks.map((b: any) => {

      if (b._id === block._id) {

        return {
          ...b,
          content: {
            ...b.content,
            [field]: value
          }
        }

      }

      return b

    })

    setBlocks(updated)

  }

  const deleteBlock = () => {

    const updated = blocks.filter((b: any) => b._id !== block._id)

    setBlocks(updated)

  }

  return (

    <div
      ref={setNodeRef}
      style={style}
      className="group border border-stone-200 rounded-lg p-4 bg-white hover:shadow-md transition"
    >

      {/* Header */}

      <div className="flex items-center gap-3 mb-3">

        {/* Drag Handle */}

        <div
          {...attributes}
          {...listeners}
          className="cursor-grab"
        >
          <GripVertical
            size={16}
            className="text-stone-400"
          />
        </div>

        <p className="text-sm font-semibold text-stone-900">
          {block.type.toUpperCase()}
        </p>

        {/* Delete */}

        <button
          onClick={deleteBlock}
          className="ml-auto opacity-0 group-hover:opacity-100 text-stone-500 hover:text-red-500 transition"
        >
          <Trash2 size={16}/>
        </button>

      </div>

      {/* Link Block */}

      {block.type === "link" && (

        <div className="flex flex-col gap-2">

          <input
            placeholder="Title"
            value={block.content?.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />

          <input
            placeholder="URL"
            value={block.content?.url || ""}
            onChange={(e) => updateContent("url", e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />

        </div>

      )}

      {/* Text Block */}

      {block.type === "text" && (

        <textarea
          placeholder="Write something..."
          value={block.content?.text || ""}
          onChange={(e) => updateContent("text", e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        />

      )}
      {/* Video Block Editor */}

      {block.type === "video" && (

        <div className="flex flex-col gap-2">

          <input
            placeholder="Video URL (YouTube / Vimeo)"
            value={block.content?.url || ""}
            onChange={(e)=>updateContent("url", e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />

        </div>

      )}

    </div>

  )

}