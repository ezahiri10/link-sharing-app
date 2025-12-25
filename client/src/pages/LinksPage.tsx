import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Link } from "@tanstack/react-router";

const PLATFORMS = [
  { value: "github", label: "GitHub", icon: "/assets/images/icon-github.svg", color: "#1A1A1A" },
  { value: "youtube", label: "YouTube", icon: "/assets/images/icon-youtube.svg", color: "#EE3939" },
  { value: "linkedin", label: "LinkedIn", icon: "/assets/images/icon-linkedin.svg", color: "#2D68FF" },
  { value: "twitter", label: "Twitter", icon: "/assets/images/icon-twitter.svg", color: "#43B7E9" },
  { value: "facebook", label: "Facebook", icon: "/assets/images/icon-facebook.svg", color: "#2442AC" },
  { value: "twitch", label: "Twitch", icon: "/assets/images/icon-twitch.svg", color: "#9146FF" },
  { value: "devto", label: "Dev.to", icon: "/assets/images/icon-devto.svg", color: "#333333" },
  { value: "codewars", label: "Codewars", icon: "/assets/images/icon-codewars.svg", color: "#8A1A50" },
  { value: "codepen", label: "CodePen", icon: "/assets/images/icon-codepen.svg", color: "#000000" },
  { value: "freecodecamp", label: "freeCodeCamp", icon: "/assets/images/icon-freecodecamp.svg", color: "#302267" },
  { value: "gitlab", label: "GitLab", icon: "/assets/images/icon-gitlab.svg", color: "#EB4925" },
  { value: "hashnode", label: "Hashnode", icon: "/assets/images/icon-hashnode.svg", color: "#0330D1" },
  { value: "stackoverflow", label: "Stack Overflow", icon: "/assets/images/icon-stack-overflow.svg", color: "#EC7100" },
  { value: "frontendmentor", label: "Frontend Mentor", icon: "/assets/images/icon-frontend-mentor.svg", color: "#67BECE" },
];

export default function LinksPage() {
  const utils = trpc.useUtils();
  const { data: links = [], isLoading } = trpc.links.getAll.useQuery();
  const { data: user } = trpc.user.me.useQuery();

  const createLink = trpc.links.create.useMutation({
    onSuccess: () => {
      utils.links.getAll.invalidate();
      setShowForm(false);
      setPlatform("");
      setUrl("");
      setUrlError("");
    },
  });

  const deleteLink = trpc.links.delete.useMutation({
    onSuccess: () => utils.links.getAll.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUrlError("");
    if (!platform || !url) {
      if (!url) setUrlError("Can't be empty");
      return;
    }
    createLink.mutate({ platform, url });
  }

  function getPlatformInfo(value: string) {
    return (
      PLATFORMS.find((p) => p.value === value) ?? {
        label: value,
        icon: null,
        color: "#808080",
      }
    );
  }

  return (
    <>
      <style>{`
        #links-page-main {
          padding-top: 88px !important;
        }
        #phone-preview-sticky {
          top: 112px !important;
        }
        #links-editor-content {
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }
        body {
          background-color: #FFFFFF !important;
          min-height: 100vh;
        }
        @media (min-width: 1024px) {
          #links-page-main {
            padding-top: 112px !important;
          }
        }
        .group:hover .group-hover\:profile-purple {
          filter: invert(32%) sepia(97%) saturate(7492%) hue-rotate(251deg) brightness(91%) contrast(101%) !important;
        }
      `}</style>
      
      <div className="min-h-screen bg-white w-full overflow-x-hidden">
        {/* HEADER - Responsive height and padding */}
        <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 lg:h-20 z-50 bg-white border-b border-[#E2E2E2]">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 h-full flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <img src="/assets/images/logo-devlinks-small.svg" alt="devlinks" className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex-shrink-0" />
              <span className="hidden sm:inline font-semibold text-sm sm:text-base lg:text-lg text-[#333333] truncate">devlinks</span>
            </div>

            {/* Navigation */}
            <nav className="flex gap-0.5 sm:gap-1 lg:gap-2">
              <Link
                to="/dashboard/links"
                className="flex items-center gap-1 px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 rounded-md lg:rounded-lg bg-[#EFEBFF] text-[#633CFF]"
              >
                <img
                  src="/assets/images/icon-link.svg"
                  alt="Links"
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 filter group-hover:invert group-hover:brightness-0"
                  style={{ filter: 'invert(32%) sepia(97%) saturate(7492%) hue-rotate(251deg) brightness(91%) contrast(101%)' }}
                />
                <span className="hidden sm:inline text-[10px] sm:text-xs lg:text-sm font-semibold">Links</span>
              </Link>

              <Link
                to="/dashboard/profile"
                className="group flex items-center gap-1 px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 rounded-md lg:rounded-lg text-[#737373] hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21 20"
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 fill-[#737373] group-hover:fill-[#633CFF] transition-colors"
                >
                  <path d="M10.5 1.563A8.437 8.437 0 1 0 18.938 10 8.447 8.447 0 0 0 10.5 1.562ZM6.716 15.357a4.688 4.688 0 0 1 7.568 0 6.54 6.54 0 0 1-7.568 0Zm1.596-5.982a2.188 2.188 0 1 1 4.376 0 2.188 2.188 0 0 1-4.376 0Zm7.344 4.683a6.523 6.523 0 0 0-2.265-1.83 4.062 4.062 0 1 0-5.782 0 6.522 6.522 0 0 0-2.265 1.83 6.562 6.562 0 1 1 10.304 0h.008Z" />
                </svg>
                <span className="hidden sm:inline text-[10px] sm:text-xs lg:text-sm text-[#737373] group-hover:text-[#633CFF] transition-colors">Profile Details</span>
              </Link>
            </nav>

            {/* Preview Button - With white background */}
            <button
              onClick={() => user?.id && window.open(`/preview/${user.id}`, "_blank")}
              className="flex items-center gap-1 bg-white border border-[#633CFF] text-[#633CFF] px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 rounded-md lg:rounded-lg hover:bg-[#EFEBFF] active:bg-[#EFEBFF] disabled:border-[#D9D9D9] disabled:text-[#737373] disabled:cursor-not-allowed flex-shrink-0 transition"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M19.61 9.62c-.03-.064-.714-1.583-2.225-3.095-2.023-2.02-4.572-3.088-7.385-3.088-2.812 0-5.362 1.068-7.382 3.088C1.106 8.037.422 9.556.391 9.62a.944.944 0 0 0 0 .761c.029.064.713 1.583 2.226 3.095 2.021 2.02 4.57 3.086 7.383 3.086 2.813 0 5.362-1.067 7.381-3.086 1.513-1.512 2.197-3.03 2.226-3.095a.946.946 0 0 0 .003-.761Zm-3.599 2.578c-1.677 1.651-3.7 2.49-6.01 2.49-2.313 0-4.334-.839-6.01-2.491A10.185 10.185 0 0 1 2.307 10a10.192 10.192 0 0 1 1.686-2.196C5.667 6.15 7.688 5.312 10 5.312s4.333.839 6.009 2.492c.659.652 1.226 1.39 1.685 2.196a10.19 10.19 0 0 1-1.685 2.197h.002Z" fill="currentColor"/>
                <path d="M10 6.875A3.13 3.13 0 0 0 6.875 10 3.13 3.13 0 0 0 10 13.125 3.13 3.13 0 0 0 13.125 10 3.13 3.13 0 0 0 10 6.875Zm0 4.375c-.69 0-1.25-.56-1.25-1.25S9.31 8.75 10 8.75s1.25.56 1.25 1.25-.56 1.25-1.25 1.25Z" fill="currentColor"/>
              </svg>
              <span className="hidden sm:inline text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">Preview</span>
            </button>
          </div>
        </header>

        {/* MAIN - Responsive padding */}
        <main 
          id="links-page-main"
          className="w-full max-w-7xl mx-auto px-2 sm:px-4 pb-4 sm:pb-6 lg:pb-8 min-h-screen bg-white"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            
            {/* PHONE PREVIEW - Hidden on mobile/tablet */}
            <div
              id="phone-preview-sticky"
              className="hidden lg:flex lg:col-span-2 justify-center items-start sticky self-start mt-8"
            >
              <div className="bg-white rounded-xl p-6 w-full max-w-md flex justify-center">
                <div className="relative inline-block">
                  <img
                    src="/assets/images/illustration-phone-mockup.svg"
                    alt="phone preview"
                    className="w-full max-w-[307px] h-auto"
                  />
                  
                  {/* Content overlay */}
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

            {/* EDITOR - Responsive */}
            <div className="lg:col-span-3 bg-[#FFFFFF] rounded-lg sm:rounded-xl w-full flex flex-col border border-gray-100">
              
              {/* FIXED HEADER - Remove the form from here */}
              <div className="bg-[#FFFFFF] p-5 space-y-3 w-full max-w-xl mx-auto mt-8">
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Customize your links</h1>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-[#737373] mt-0.5 sm:mt-1">
                    Add/edit/remove links below and then share all your profiles with the world!
                  </p>
                </div>
                {/* Add New Link Button - With white background */}
                <button
                  onClick={() => setShowForm(true)}
                  disabled={showForm}
                  className="w-full bg-white border border-[#633CFF] text-[#633CFF] py-2 sm:py-2.5 lg:py-3 rounded-md lg:rounded-lg text-[11px] sm:text-xs lg:text-sm font-semibold hover:bg-[#EFEBFF] active:bg-[#EFEBFF] disabled:border-[#D9D9D9] disabled:text-[#737373] disabled:cursor-not-allowed transition"
                >
                  + Add new link
                </button>
                {/* Form removed from here */}
              </div>

              {/* SCROLLABLE CONTENT */}
              <div id="links-editor-content" className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 flex-1" style={{ marginTop: 10 }}>
                
                {/* ADD LINK FORM - Moved here, now appears at the top of the links list */}
                {showForm && (
                  <div className="bg-[#FAFAFA] rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-700 font-bold flex items-center gap-2">
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                          <path d="M1 1h10M1 5h10" stroke="#737373" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Link #{links.length + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setPlatform("");
                          setUrl("");
                          setUrlError("");
                        }}
                        className="bg-[#FFFFFF] text-[#737373] hover:text-red-500 text-sm font-medium px-3 py-1.5 transition"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Platform Dropdown */}
                      <div>
                        <label className="text-xs text-gray-700 mb-1 block">Platform</label>
                        <select
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value)}
                          className="w-full rounded-lg border border-[#E2E2E2] px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#633CFF] focus:border-[#633CFF] cursor-pointer bg-white"
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

                      {/* URL Input */}
                      <div>
                        <label className="text-xs text-gray-700 mb-1 block">Link</label>
                        <div className="relative">
                          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <input
                            type="url"
                            placeholder="e.g. https://www.github.com/johnappleseed"
                            value={url}
                            onChange={(e) => {
                              setUrl(e.target.value);
                              setUrlError("");
                            }}
                            className={`w-full rounded-lg border ${
                              urlError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#E2E2E2] focus:ring-[#633CFF] focus:border-[#633CFF]"
                            } pl-11 pr-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 bg-white`}
                            required
                          />
                          {urlError && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-500">
                              {urlError}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={createLink.isPending}
                          className={`px-6 py-3 rounded-lg font-semibold text-sm transition ${
                            createLink.isPending
                              ? "bg-[#EFEBFF] text-[#633CFF] cursor-not-allowed opacity-50"
                              : "bg-[#633CFF] text-white hover:opacity-90"
                          }`}
                        >
                          {createLink.isPending ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* EMPTY STATE */}
                {!isLoading && links.length === 0 && !showForm && (
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
                )}

                {/* EXISTING LINKS LIST */}
                {!isLoading && links.length > 0 && (
                  <div className="space-y-4">
                    {links.map((link, index) => {
                      const platform = getPlatformInfo(link.platform);
                      return (
                        <div key={link.id} className="bg-[#FAFAFA] rounded-xl p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                              <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                <path d="M1 1h10M1 5h10" stroke="#737373" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              Link #{index + 1}
                            </h3>
                            <button
                              onClick={() => deleteLink.mutate({ id: link.id })}
                              disabled={deleteLink.isPending}
                              className="bg-white text-[#737373] hover:text-red-500 text-sm font-medium px-3 py-1.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="space-y-3">
                            {/* Platform Display */}
                            <div>
                              <label className="text-xs text-gray-700 mb-1 block">Platform</label>
                              <div className="flex items-center gap-3 w-full rounded-lg border border-[#E2E2E2] px-4 py-3 bg-white">
                                {platform.icon && (
                                  <img src={platform.icon} alt="" className="w-4 h-4 flex-shrink-0" />
                                )}
                                <span className="text-sm text-gray-900">{platform.label}</span>
                              </div>
                            </div>

                            {/* URL Display */}
                            <div>
                              <label className="text-xs text-gray-700 mb-1 block">Link</label>
                              <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <input
                                  type="text"
                                  value={link.url}
                                  readOnly
                                  className="w-full rounded-lg border border-[#E2E2E2] pl-11 pr-3 py-3 text-sm bg-white text-gray-900"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
