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

function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0).toUpperCase() || "";
  const last = lastName?.charAt(0).toUpperCase() || "";
  return first + last;
}

function getDisplayName(firstName?: string, lastName?: string): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || "";
}

export function PhonePreview({ links, profile }: PhonePreviewProps) {
  const initials = getInitials(profile?.firstName, profile?.lastName);
  const displayName = getDisplayName(profile?.firstName, profile?.lastName);
  const hasImage = profile?.imageUrl && profile.imageUrl.trim() !== "" && profile.imageUrl !== "https://via.placeholder.com/500";

  return (
    <div
      id="phone-preview-sticky"
      className="hidden lg:flex lg:col-span-2 justify-center items-start sticky self-start mt-8"
      style={{ top: "112px" }}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md flex justify-center">
        <div className="relative inline-block">
          <img
            src="/assets/images/illustration-phone-mockup.svg"
            alt="phone preview"
            className="w-full max-w-[307px] h-auto"
          />
          
          {/* Profile Info Overlay */}
          <div className="absolute inset-0 flex flex-col items-center pt-[60px] px-[35px]">
            {/* Avatar - Only show if image exists */}
            {hasImage && (
              <div className="w-24 h-24 rounded-full border-4 border-[#633CFF] overflow-hidden flex items-center justify-center bg-white">
                <img 
                  src={profile.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Name */}
            <div className={hasImage ? "mt-6 text-center" : "mt-16 text-center"}>
              {displayName ? (
                <h2 className="text-lg font-semibold text-[#333333]">
                  {displayName}
                </h2>
              ) : (
                <div className="h-4 w-40 bg-[#EEEBFF] rounded" />
              )}
            </div>

            {/* Email */}
            <div className="mt-2 text-center">
              {profile?.email ? (
                <p className="text-sm text-[#737373]">
                  {profile.email}
                </p>
              ) : (
                <div className="h-2 w-20 bg-[#EEEBFF] rounded" />
              )}
            </div>

            {/* Links */}
            <div className="w-full max-w-[237px] space-y-5 mt-14">
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
                    <svg className="w-3 h-3 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 16 16" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l5 5-5 5" />
                    </svg>
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
