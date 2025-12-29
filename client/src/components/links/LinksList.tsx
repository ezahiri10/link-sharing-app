import { LinkItem } from "./LinkItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface LinksListProps {
  links: Array<{
    id: number;
    platform: string;
    url: string;
    display_order?: number;
  }>;
  onUpdate: (id: number, platform: string, url: string) => void;
  onDelete: (id: number) => void;
  onReorder: (links: Array<{ id: number; position: number }>) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function LinksList({ links, onUpdate, onDelete, onReorder, isUpdating, isDeleting }: LinksListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      const reorderedLinks = arrayMove(links, oldIndex, newIndex);
      
      const updatedOrder = reorderedLinks.map((link, index) => ({
        id: link.id,
        position: index,
      }));

      onReorder(updatedOrder);
    }
  };

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <img
          src="/assets/images/illustration-empty.svg"
          alt="No links yet"
          className="w-32 h-32 mb-6"
        />
        <h2 className="text-xl font-bold text-text-dark mb-2">
          Let's get you started
        </h2>
        <p className="text-sm text-text-gray max-w-md">
          Use the "Add new link" button to get started. Once you have more than one link, you can reorder and edit them.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map((link) => link.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {links.map((link, index) => (
            <LinkItem
              key={link.id}
              link={link}
              index={index}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
