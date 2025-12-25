import { LinkItem } from "./LinkItem";

interface Link {
  id: number;
  platform: string;
  url: string;
}

interface LinksListProps {
  links: Link[];
  onUpdate: (id: number, platform: string, url: string) => void;
  onDelete: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function LinksList({ links, onUpdate, onDelete, isUpdating, isDeleting }: LinksListProps) {
  if (links.length === 0) {
    return (
      <div className="bg-[#FAFAFA] rounded-xl p-10 text-center space-y-6">
        <img
          src="/assets/images/illustration-empty.svg"
          alt="empty"
          className="mx-auto w-32 lg:w-auto max-w-full"
        />
        <h2 className="text-xl font-bold text-gray-900">Let's get you started</h2>
        <p className="text-sm text-[#737373] max-w-md mx-auto leading-relaxed">
          Use the "Add new link" button to get started. Once you have more than one link, you can reorder and edit them. We're here to help you share your profiles with everyone!
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
          linkNumber={index + 1}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
