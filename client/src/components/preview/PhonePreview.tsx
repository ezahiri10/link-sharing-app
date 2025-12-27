import { getPlatformInfo } from "../../constants/platforms";

interface Link {
  id: number;
  platform: string;
  url: string;
}

interface PhonePreviewProps {
  links: Link[];
  profile?: {
    imageUrl?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

/* ---------- helpers ---------- */

function clampText(text?: string, max = 30) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function getDisplayName(firstName?: string, lastName?: string) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

/* ---------- component ---------- */

export function PhonePreview({ links, profile }: PhonePreviewProps) {
  const displayName = getDisplayName(profile?.firstName, profile?.lastName);

  const hasImage =
    profile?.imageUrl &&
    profile.imageUrl.trim() !== "" &&
    profile.imageUrl !== "https://via.placeholder.com/500";

  return (
    <div
      className="hidden lg:flex lg:col-span-2 justify-center sticky mt-8"
      style={{ top: "112px" }}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md flex justify-center">
        <div className="relative">
          <img
            src="/assets/images/illustration-phone-mockup.svg"
            alt="Phone preview"
            className="w-full max-w-[307px]"
          />

          {/* ---------- overlay ---------- */}
          <div className="absolute inset-0 flex flex-col items-center px-[35px] pt-[60px]">
            
            {/* Avatar */}
            {hasImage && (
              <div className="w-24 h-24 rounded-full border-4 border-[#633CFF] bg-white overflow-hidden">
                <img
                  src={profile!.imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Name */}
            <div className={`${hasImage ? "mt-6" : "mt-16"} h-[28px] max-w-[237px]`}>
              {displayName ? (
                <h2
                  className="text-lg font-semibold text-[#333333] truncate whitespace-nowrap text-center"
                  title={displayName}
                >
                  {clampText(displayName, 30)}
                </h2>
              ) : (
                <div className="h-4 w-40 bg-[#EEEBFF] rounded mx-auto" />
              )}
            </div>

            {/* Email */}
            <div className="mt-2 h-[20px] max-w-[237px]">
              {profile?.email ? (
                <p
                  className="text-sm text-[#737373] truncate whitespace-nowrap text-center"
                  title={profile.email}
                >
                  {clampText(profile.email, 32)}
                </p>
              ) : (
                <div className="h-2 w-20 bg-[#EEEBFF] rounded mx-auto" />
              )}
            </div>

            {/* Links - Fixed position */}
            <div className="w-full max-w-[237px] space-y-5 mt-14 flex-shrink-0">
              {links.slice(0, 5).map((link) => {
                const platformInfo = getPlatformInfo(link.platform);
                return (
                  <div
                    key={link.id}
                    style={{ backgroundColor: platformInfo.color }}
                    className="rounded-lg px-4 py-3 flex items-center justify-between text-white min-h-[44px]"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {platformInfo.icon && (
                        <img 
                          src={platformInfo.icon} 
                          alt="" 
                          className="w-4 h-4 flex-shrink-0 brightness-0 invert" 
                        />
                      )}
                      <span className="text-xs font-medium truncate">
                        {platformInfo.label}
                      </span>
                    </div>
                    <img 
                      src="/assets/images/icon-arrow-right.svg" 
                      alt="" 
                      className="w-3 h-3 flex-shrink-0 ml-2" 
                    />
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
