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
  const hasImage = profile?.imageUrl && profile.imageUrl.trim() !== "";

  return (
    <div
      id="phone-preview-sticky"
      className="hidden lg:flex lg:col-span-2 justify-center items-start sticky self-start mt-8 pt-20"
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
            {/* Avatar with border */}
            <div className="w-24 h-24 rounded-full border-4 border-[#633CFF] overflow-hidden flex items-center justify-center bg-[#EEEBFF]">
              {hasImage ? (
                <img 
                  src={profile.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : initials ? (
                <span className="text-3xl font-semibold text-[#633CFF]">
                  {initials}
                </span>
              ) : (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-[#633CFF]">
                  <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
                  <path
                    d="M20 20c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2.5c-3.34 0-10 1.67-10 5V30h20v-2.5c0-3.33-6.66-5-10-5z"
                    fill="#633CFF"
                  />
                </svg>
              )}
            </div>

            {/* Name */}
            <div className="mt-6 text-center">
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
