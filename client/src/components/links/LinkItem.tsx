import { useState } from "react";
import { getPlatformInfo, PLATFORMS } from "../../constants/platforms";

interface Link {
  id: number;
  platform: string;
  url: string;
}

interface LinkItemProps {
  link: Link;
  linkNumber: number;
  onUpdate: (id: number, platform: string, url: string) => void;
  onDelete: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function LinkItem({ link, linkNumber, onUpdate, onDelete, isUpdating, isDeleting }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPlatform, setEditPlatform] = useState(link.platform);
  const [editUrl, setEditUrl] = useState(link.url);
  const [editUrlError, setEditUrlError] = useState("");

  const platform = getPlatformInfo(link.platform);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditUrlError("");
    
    if (!editUrl) {
      setEditUrlError("Can't be empty");
      return;
    }
    
    try {
      new URL(editUrl);
    } catch {
      setEditUrlError("Please check the URL");
      return;
    }
    
    onUpdate(link.id, editPlatform, editUrl);
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditPlatform(link.platform);
    setEditUrl(link.url);
    setEditUrlError("");
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditUrlError("");
  };

  return (
    <div className="bg-[#FAFAFA] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
          <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
            <path d="M1 1h10M1 5h10" stroke="#737373" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Link #{linkNumber}
        </h3>
        <button
          onClick={() => onDelete(link.id)}
          disabled={isDeleting}
          className="text-[#737373] hover:text-red-500 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
        >
          Remove
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-[#333333] mb-1 block">Platform</label>
            <select
              value={editPlatform}
              onChange={(e) => setEditPlatform(e.target.value)}
              className="w-full rounded-lg border border-[#D9D9D9] px-4 py-3 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#633CFF] focus:border-[#633CFF] cursor-pointer bg-[#FFFFFF]"
              required
            >
              <option value="">Select platform</option>
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-[#333333] mb-1 block">Link</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <input
                type="text"
                value={editUrl}
                onChange={(e) => {
                  setEditUrl(e.target.value);
                  setEditUrlError("");
                }}
                className={`w-full rounded-lg border ${
                  editUrlError ? "border-[#FF3939] focus:ring-[#FF3939] focus:border-[#FF3939] text-[#FF3939]" : "border-[#D9D9D9] focus:ring-[#633CFF] focus:border-[#633CFF] text-[#333333]"
                } pl-11 pr-28 py-3 text-sm focus:outline-none focus:ring-1 bg-[#FFFFFF]`}
              />
              {editUrlError && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#FF3939]">
                  {editUrlError}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={cancelEditing}
              className="px-4 py-2 text-sm text-[#737373] hover:text-[#633CFF] transition bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-3 rounded-lg font-semibold text-sm bg-[#633CFF] text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#333333] mb-1 block">Platform</label>
            <div 
              onClick={startEditing}
              className="flex items-center gap-3 w-full rounded-lg border border-[#D9D9D9] px-4 py-3 bg-[#FFFFFF] cursor-pointer hover:border-[#633CFF] transition"
            >
              {platform.icon && (
                <img src={platform.icon} alt="" className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-sm text-[#333333]">{platform.label}</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#333333] mb-1 block">Link</label>
            <div 
              onClick={startEditing}
              className="relative cursor-pointer"
            >
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <input
                type="text"
                value={link.url}
                readOnly
                className="w-full rounded-lg border border-[#D9D9D9] pl-11 pr-3 py-3 text-sm bg-[#FFFFFF] text-[#333333] cursor-pointer hover:border-[#633CFF] transition"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
