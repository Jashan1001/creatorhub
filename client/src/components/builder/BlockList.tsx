import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBuilder } from "./BuilderContext";
import { BlockCard } from "./BlockCard";

export function BlockList() {
  const { blocks, reorderBlocks } = useBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b._id === active.id);
      const newIndex = blocks.findIndex((b) => b._id === over.id);

      reorderBlocks(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4">
          {blocks.map((block) => (
            <BlockCard key={block._id} block={block} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
