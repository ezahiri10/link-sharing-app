import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { trpc } from "../lib/trpc";
import { PreviewHeader } from "../components/preview/PreviewHeader";
import { PreviewCard } from "../components/preview/PreviewCard";
import { ClipboardToast } from "../components/ui/ClipboardToast";

export default function PreviewPage() {
  const { userId } = useParams({ from: "/preview/$userId" });
  const [showToast, setShowToast] = useState(false);

  // Fetch user data by userId from URL (not current logged-in user)
  const { data: user } = trpc.user.getUserById.useQuery(
    { userId },
    { enabled: !!userId }
  );

  const { data: links = [] } = trpc.links.getByUserId.useQuery(
    { userId },
    { enabled: !!userId }
  );

  const handleShareLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <p className="text-text-gray">Loading preview...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-[#FAFAFA] shadow-sm border border-gray-100">
        <PreviewHeader onShareLink={handleShareLink} />

        {/* Purple background section */}
        <div className="bg-[#633CFF] h-[280px] sm:h-[320px] rounded-b-[32px]" />

        {/* Preview card - overlapping purple background */}
        <div className="relative -mt-[200px] sm:-mt-[240px] px-4 pb-12">
          <PreviewCard
            firstName={user.first_name}
            lastName={user.last_name}
            email={user.profile_email}
            imageUrl={user.image}
            links={links}
          />
        </div>

        <ClipboardToast visible={showToast} />
      </div>
    </>
  );
}
