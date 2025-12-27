import { LinkItem } from "./LinkItem";

interface LinksListProps {
  links: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
  onUpdate: (id: number, platform: string, url: string) => void;
  onDelete: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function LinksList({ links, onUpdate, onDelete, isUpdating, isDeleting }: LinksListProps) {
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
  );
}
