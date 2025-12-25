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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 z-50 bg-white border-b border-[#E2E2E2]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/images/logo-devlinks-small.svg" alt="devlinks" className="w-8 h-8" />
            <span className="hidden sm:inline font-semibold text-lg">devlinks</span>
          </div>

          <nav className="flex gap-2">
            <Link
              to="/dashboard/links"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EFEBFF] text-[#633CFF]"
            >
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                <path d="M11.154 14.65a.936.936 0 0 1 0 1.329l-.464.464a4.689 4.689 0 1 1-6.631-6.631l1.579-1.578a.938.938 0 0 1 1.327 1.327l-1.579 1.579a2.813 2.813 0 0 0 3.978 3.978l.463-.463a.936.936 0 0 1 1.327 0ZM16.346 3.05a4.695 4.695 0 0 0-6.631 0l-.464.463a.936.936 0 1 0 1.327 1.327l.464-.463a2.813 2.813 0 0 1 3.978 3.978l-1.579 1.579a.938.938 0 0 0 1.327 1.327l1.579-1.579a4.695 4.695 0 0 0 0-6.631Z" fill="currentColor"/>
              </svg>
              <span className="hidden sm:inline text-sm font-semibold">Links</span>
            </Link>

            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#737373] hover:bg-gray-100"
            >
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                <path d="M10.5 1.563A8.437 8.437 0 1 0 18.938 10 8.447 8.447 0 0 0 10.5 1.562ZM6.716 15.357a4.688 4.688 0 0 1 7.568 0 6.54 6.54 0 0 1-7.568 0Zm1.596-5.982a2.188 2.188 0 1 1 4.376 0 2.188 2.188 0 0 1-4.376 0Zm7.344 4.683a6.523 6.523 0 0 0-2.265-1.83 4.062 4.062 0 1 0-5.782 0 6.522 6.522 0 0 0-2.265 1.83 6.562 6.562 0 1 1 10.304 0h.008Z" fill="currentColor"/>
              </svg>
              <span className="hidden sm:inline text-sm">Profile Details</span>
            </Link>
          </nav>

          <button
            onClick={() => user?.id && window.open(`/preview/${user.id}`, "_blank")}
            className="flex items-center gap-2 border border-[#633CFF] text-[#633CFF] px-4 py-2 rounded-lg hover:bg-[#EFEBFF]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.61 9.62c-.03-.064-.714-1.583-2.225-3.095-2.023-2.02-4.572-3.088-7.385-3.088-2.812 0-5.362 1.068-7.382 3.088C1.106 8.037.422 9.556.391 9.62a.944.944 0 0 0 0 .761c.029.064.713 1.583 2.226 3.095 2.021 2.02 4.57 3.086 7.383 3.086 2.813 0 5.362-1.067 7.381-3.086 1.513-1.512 2.197-3.03 2.226-3.095a.946.946 0 0 0 .003-.761Zm-3.599 2.578c-1.677 1.651-3.7 2.49-6.01 2.49-2.313 0-4.334-.839-6.01-2.491A10.185 10.185 0 0 1 2.307 10a10.192 10.192 0 0 1 1.686-2.196C5.667 6.15 7.688 5.312 10 5.312s4.333.839 6.009 2.492c.659.652 1.226 1.39 1.685 2.196a10.19 10.19 0 0 1-1.685 2.197h.002Z" fill="currentColor"/>
              <path d="M10 6.875A3.13 3.13 0 0 0 6.875 10 3.13 3.13 0 0 0 10 13.125 3.13 3.13 0 0 0 13.125 10 3.13 3.13 0 0 0 10 6.875Zm0 4.375c-.69 0-1.25-.56-1.25-1.25S9.31 8.75 10 8.75s1.25.56 1.25 1.25-.56 1.25-1.25 1.25Z" fill="currentColor"/>
            </svg>
            <span className="hidden sm:inline text-sm font-semibold">Preview</span>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full max-w-7xl mx-auto px-4 pt-[96px] pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* PHONE PREVIEW */}
          <div
            className="hidden lg:flex lg:col-span-2 justify-center items-start sticky self-start"
            style={{ top: "96px" }}
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

          {/* EDITOR */}
          <div className="lg:col-span-3 bg-white rounded-xl p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customize your links</h1>
              <p className="text-sm text-[#737373] mt-1">
                Add/edit/remove links below and then share all your profiles with the world!
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              disabled={showForm}
              className="w-full border border-[#633CFF] text-[#633CFF] py-3 rounded-lg text-sm font-semibold hover:bg-[#EFEBFF] disabled:opacity-50"
            >
              + Add new link
            </button>

            {!isLoading &&
              links.map((link, index) => {
                const platform = getPlatformInfo(link.platform);
                return (
                  <div key={link.id} className="bg-[#FAFAFA] rounded-xl p-5">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-bold text-gray-700">Link #{index + 1}</h3>
                      <button
                        onClick={() => deleteLink.mutate({ id: link.id })}
                        className="text-sm text-[#737373] hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-sm text-gray-900">{platform.label}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}
