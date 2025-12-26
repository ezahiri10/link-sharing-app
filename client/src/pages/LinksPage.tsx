import { useState } from "react";
import { trpc } from "../lib/trpc";
import { DashboardHeader } from "../components/layout/DashboardHeader";
import { PhonePreview } from "../components/preview/PhonePreview";
import { AddLinkForm } from "../components/links/AddLinkForm";
import { LinksList } from "../components/links/LinksList";
import { useNavigate } from "@tanstack/react-router";

export default function LinksPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  
  const { data: links = [], isLoading } = trpc.links.getAll.useQuery(undefined, {
    retry: false,
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        localStorage.removeItem('sessionId');
        navigate({ to: '/login' });
      }
    },
  });
  
  const { data: user } = trpc.user.me.useQuery(undefined, {
    retry: false,
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        localStorage.removeItem('sessionId');
        navigate({ to: '/login' });
      }
    },
  });

  const createLink = trpc.links.create.useMutation({
    onSuccess: () => {
      utils.links.getAll.invalidate();
      setShowForm(false);
    },
  });

  const updateLink = trpc.links.update.useMutation({
    onSuccess: () => {
      utils.links.getAll.invalidate();
    },
  });

  const deleteLink = trpc.links.delete.useMutation({
    onSuccess: () => utils.links.getAll.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);

  const handleCreateLink = (platform: string, url: string) => {
    createLink.mutate({ platform, url });
  };

  const handleUpdateLink = (id: number, platform: string, url: string) => {
    updateLink.mutate({ id, platform, url });
  };

  const handleDeleteLink = (id: number) => {
    deleteLink.mutate({ id });
  };

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
      `}</style>
      
      <div className="min-h-screen bg-white w-full overflow-x-hidden">
        <DashboardHeader userId={user?.id} activeTab="links" />

        <main 
          id="links-page-main"
          className="w-full max-w-7xl mx-auto px-2 sm:px-4 pb-4 sm:pb-6 lg:pb-8 min-h-screen bg-white"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            
            <PhonePreview 
              links={links}
              profile={user ? {
                imageUrl: user.image ?? "",
                firstName: user.first_name ?? "",
                lastName: user.last_name ?? "",
                email: user.profile_email ?? "",
              } : undefined}
            />

            <div className="lg:col-span-3 bg-[#FFFFFF] rounded-lg sm:rounded-xl w-full flex flex-col border border-gray-100  md:pt-6">
              
              <div className="bg-[#FFFFFF] p-5 space-y-3 w-full mx-auto mt-8">
                <div className="text-left">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Customize your links</h1>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-[#737373] mt-0.5 sm:mt-1">
                    Add/edit/remove links below and then share all your profiles with the world!
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  disabled={showForm}
                  className="w-full bg-white border border-[#633CFF] text-[#633CFF] py-2 sm:py-2.5 lg:py-3 rounded-md lg:rounded-lg text-[11px] sm:text-xs lg:text-sm font-semibold hover:bg-[#EFEBFF] active:bg-[#EFEBFF] disabled:border-[#D9D9D9] disabled:text-[#737373] disabled:cursor-not-allowed transition"
                >
                  + Add new link
                </button>
              </div>

              <div id="links-editor-content" className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 flex-1" style={{ marginTop: 10 }}>
                
                {showForm && (
                  <AddLinkForm
                    linkNumber={links.length + 1}
                    onSubmit={handleCreateLink}
                    onCancel={() => setShowForm(false)}
                    isPending={createLink.isPending}
                  />
                )}

                {!isLoading && (
                  <LinksList
                    links={links}
                    onUpdate={handleUpdateLink}
                    onDelete={handleDeleteLink}
                    isUpdating={updateLink.isPending}
                    isDeleting={deleteLink.isPending}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
