import { getPlatformInfo } from "../../constants/platforms";

interface Link {
  id: number;
  platform: string;
  url: string;
}

interface PhonePreviewProps {
  links: Link[];
}

export function PhonePreview({ links }: PhonePreviewProps) {
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
          
          <div className="absolute inset-0 flex flex-col items-center pt-[278px] px-[35px]">
            <div className="w-full max-w-[237px] space-y-5">
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
