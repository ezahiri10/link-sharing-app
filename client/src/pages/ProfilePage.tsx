import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { DashboardHeader } from "../components/layout/DashboardHeader";
import { PhonePreview } from "../components/preview/PhonePreview";
import { ProfileForm } from "../components/profile/ProfileForm";
import { Toast } from "../components/ui/Toast";
import { useNavigate } from "@tanstack/react-router";

export default function ProfilePage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const { data: user } = trpc.user.me.useQuery(undefined, {
    retry: false,
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        localStorage.removeItem("sessionId");
        navigate({ to: "/login" });
      }
    },
  });
  const { data: links = [] } = trpc.links.getAll.useQuery(undefined, {
    retry: false,
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        localStorage.removeItem("sessionId");
        navigate({ to: "/login" });
      }
    },
  });

  const [showToast, setShowToast] = useState(false);

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Initialize state when user data loads
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
      // Don't use login email as default - only use if explicitly saved in profile
      setEmail(user.profile_email ?? "");
      setAvatarPreview(user.image ?? "");
    }
  }, [user]);

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: (data) => {
      // Update cache with new data including Cloudinary URL
      utils.user.me.setData(undefined, data);
      setAvatarFile(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const handleImageChange = (file: File, preview: string) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let avatarBase64: string | undefined;

    // Convert file to base64 if image was uploaded
    if (avatarFile) {
      avatarBase64 = await fileToBase64(avatarFile);
    }

    updateProfile.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      avatarBase64,
    });
  };

  const hasChanges =
    firstName !== (user?.first_name ?? "") ||
    lastName !== (user?.last_name ?? "") ||
    email !== (user?.email ?? "") ||
    avatarFile !== null;

  if (!user) return null;

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

      <div className="min-h-screen bg-white w-full overflow-x-hidden">
        <DashboardHeader userId={user.id} activeTab="profile" />

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-28 pb-8 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* PhonePreview now receives real-time profile data */}
            <PhonePreview
              links={links}
              profile={{
                imageUrl: avatarPreview,
                firstName: firstName,
                lastName: lastName,
                email: email,
              }}
            />

            <div className="lg:col-span-3 bg-white rounded-xl p-6 sm:p-10">
              <ProfileForm
                user={user}
                firstName={firstName}
                lastName={lastName}
                email={email}
                avatarPreview={avatarPreview}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onEmailChange={setEmail}
                onImageChange={handleImageChange}
                onSubmit={handleSubmit}
                isPending={updateProfile.isPending}
                hasChanges={hasChanges}
              />
            </div>
          </div>
        </main>

        <Toast
          message="Your changes have been successfully saved!"
          visible={showToast}
        />
      </div>
    </>
  );
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
