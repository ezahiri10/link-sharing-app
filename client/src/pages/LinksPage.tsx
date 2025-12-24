import { useState } from 'react'
import { trpc } from '../lib/trpc'
import { Link, useNavigate } from '@tanstack/react-router'

const PLATFORMS = [
  { value: 'github', label: 'GitHub', icon: '/assets/images/icon-github.svg', color: '#1A1A1A' },
  { value: 'youtube', label: 'YouTube', icon: '/assets/images/icon-youtube.svg', color: '#EE3939' },
  { value: 'linkedin', label: 'LinkedIn', icon: '/assets/images/icon-linkedin.svg', color: '#2D68FF' },
  { value: 'twitter', label: 'Twitter', icon: '/assets/images/icon-twitter.svg', color: '#43B7E9' },
  { value: 'facebook', label: 'Facebook', icon: '/assets/images/icon-facebook.svg', color: '#2442AC' },
  { value: 'twitch', label: 'Twitch', icon: '/assets/images/icon-twitch.svg', color: '#9146FF' },
  { value: 'devto', label: 'Dev.to', icon: '/assets/images/icon-devto.svg', color: '#333333' },
  { value: 'codewars', label: 'Codewars', icon: '/assets/images/icon-codewars.svg', color: '#8A1A50' },
  { value: 'codepen', label: 'CodePen', icon: '/assets/images/icon-codepen.svg', color: '#000000' },
  { value: 'freecodecamp', label: 'freeCodeCamp', icon: '/assets/images/icon-freecodecamp.svg', color: '#302267' },
  { value: 'gitlab', label: 'GitLab', icon: '/assets/images/icon-gitlab.svg', color: '#EB4925' },
  { value: 'hashnode', label: 'Hashnode', icon: '/assets/images/icon-hashnode.svg', color: '#0330D1' },
  { value: 'stackoverflow', label: 'Stack Overflow', icon: '/assets/images/icon-stack-overflow.svg', color: '#EC7100' },
  { value: 'frontendmentor', label: 'Frontend Mentor', icon: '/assets/images/icon-frontend-mentor.svg', color: '#67BECE' },
]

export default function LinksPage() {
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const { data: links = [], isLoading } = trpc.links.getAll.useQuery()
  const { data: user } = trpc.user.me.useQuery()

  const createLink = trpc.links.create.useMutation({
    onSuccess: () => {
      utils.links.getAll.invalidate()
      setShowForm(false)
      setPlatform('')
      setUrl('')
    },
  })

  const deleteLink = trpc.links.delete.useMutation({
    onSuccess: () => {
      utils.links.getAll.invalidate()
    },
  })

  const [showForm, setShowForm] = useState(false)
  const [platform, setPlatform] = useState('')
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUrlError('')
    
    if (!platform || !url) {
      if (!url) setUrlError("Can't be empty")
      return
    }

    createLink.mutate({ platform, url })
  }

  function getPlatformInfo(platformValue: string) {
    return PLATFORMS.find(p => p.value === platformValue) || { 
      label: platformValue, 
      icon: null,
      color: '#808080'
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-[#E2E2E2]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/images/logo-devlinks-small.svg"
              alt="devlinks"
              className="w-8 h-8"
            />
            <span className="hidden sm:inline font-semibold text-lg">
              devlinks
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex gap-2">
            {/* Links (active) */}
            <Link
              to="/dashboard/links"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EFEBFF] text-[#633CFF]"
            >
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                <path d="M11.154 14.65a.936.936 0 0 1 0 1.329l-.464.464a4.689 4.689 0 1 1-6.631-6.631l1.579-1.578a.938.938 0 0 1 1.327 1.327l-1.579 1.579a2.813 2.813 0 0 0 3.978 3.978l.463-.463a.936.936 0 0 1 1.327 0ZM16.346 3.05a4.695 4.695 0 0 0-6.631 0l-.464.463a.936.936 0 1 0 1.327 1.327l.464-.463a2.813 2.813 0 0 1 3.978 3.978l-1.579 1.579a.938.938 0 0 0 1.327 1.327l1.579-1.579a4.695 4.695 0 0 0 0-6.631Z" fill="currentColor"/>
              </svg>
              <span className="hidden sm:inline text-sm font-semibold">
                Links
              </span>
            </Link>

            {/* Profile */}
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#737373] hover:bg-gray-100"
            >
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                <path d="M10.5 1.563A8.437 8.437 0 1 0 18.938 10 8.447 8.447 0 0 0 10.5 1.562ZM6.716 15.357a4.688 4.688 0 0 1 7.568 0 6.54 6.54 0 0 1-7.568 0Zm1.596-5.982a2.188 2.188 0 1 1 4.376 0 2.188 2.188 0 0 1-4.376 0Zm7.344 4.683a6.523 6.523 0 0 0-2.265-1.83 4.062 4.062 0 1 0-5.782 0 6.522 6.522 0 0 0-2.265 1.83 6.562 6.562 0 1 1 10.304 0h.008Z" fill="currentColor"/>
              </svg>
              <span className="hidden sm:inline text-sm">
                Profile Details
              </span>
            </Link>
          </nav>

          {/* Preview */}
          <button
            onClick={() => user?.id && window.open(`/preview/${user.id}`, '_blank')}
            className="flex items-center gap-2 border border-[#633CFF] text-[#633CFF] px-4 py-2 rounded-lg hover:bg-[#EFEBFF]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.61 9.62c-.03-.064-.714-1.583-2.225-3.095-2.023-2.02-4.572-3.088-7.385-3.088-2.812 0-5.362 1.068-7.382 3.088C1.106 8.037.422 9.556.391 9.62a.944.944 0 0 0 0 .761c.029.064.713 1.583 2.226 3.095 2.021 2.02 4.57 3.086 7.383 3.086 2.813 0 5.362-1.067 7.381-3.086 1.513-1.512 2.197-3.03 2.226-3.095a.946.946 0 0 0 .003-.761Zm-3.599 2.578c-1.677 1.651-3.7 2.49-6.01 2.49-2.313 0-4.334-.839-6.01-2.491A10.185 10.185 0 0 1 2.307 10a10.192 10.192 0 0 1 1.686-2.196C5.667 6.15 7.688 5.312 10 5.312s4.333.839 6.009 2.492c.659.652 1.226 1.39 1.685 2.196a10.19 10.19 0 0 1-1.685 2.197h.002Z" fill="currentColor"/>
              <path d="M10 6.875A3.13 3.13 0 0 0 6.875 10 3.13 3.13 0 0 0 10 13.125 3.13 3.13 0 0 0 13.125 10 3.13 3.13 0 0 0 10 6.875Zm0 4.375c-.69 0-1.25-.56-1.25-1.25S9.31 8.75 10 8.75s1.25.56 1.25 1.25-.56 1.25-1.25 1.25Z" fill="currentColor"/>
            </svg>
            <span className="hidden sm:inline text-sm font-semibold">
              Preview
            </span>
          </button>

        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">

          {/* PHONE PREVIEW (DESKTOP ONLY) */}
          <div className="hidden lg:flex justify-center items-start">
            <div className="bg-white rounded-xl p-6">
              <div className="relative">
                <img
                  src="/assets/images/illustration-phone-mockup.svg"
                  alt="phone preview"
                  className="w-[307px] h-[631px]"
                />
                
                {/* Content overlay - only for dynamic links */}
                <div className="absolute top-[278px] left-[35px] right-[35px] space-y-5">
                  {links.slice(0, 5).map((link) => {
                    const platformInfo = getPlatformInfo(link.platform)
                    return (
                      <div
                        key={link.id}
                        style={{ backgroundColor: platformInfo.color }}
                        className="rounded-lg p-4 flex items-center justify-between text-white h-[44px]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
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
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 16 16" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l5 5-5 5" />
                        </svg>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* LINKS EDITOR */}
          <div className="bg-white rounded-xl p-6 space-y-6">

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Customize your links
              </h1>
              <p className="text-sm text-[#737373] mt-1">
                Add/edit/remove links below and then share all your profiles with the world!
              </p>
            </div>

            {/* Add new link */}
            <button
              onClick={() => setShowForm(true)}
              disabled={showForm}
              className="w-full border border-[#633CFF] text-[#633CFF] py-3 rounded-lg text-sm font-semibold hover:bg-[#EFEBFF] transition disabled:opacity-50"
            >
              + Add new link
            </button>

            {/* Add link form */}
            {showForm && (
              <div className="bg-[#FAFAFA] rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 font-bold flex items-center gap-2">
                    <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                      <path d="M1 1h10M1 5h10" stroke="#737373" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Link #{links.length + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setPlatform('')
                      setUrl('')
                      setUrlError('')
                    }}
                    className="text-[#737373] hover:text-red-500 text-sm font-medium transition"
                  >
                    Remove
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-700 mb-1 block">Platform</label>
                    <select
                      value={platform}
                      onChange={e => setPlatform(e.target.value)}
                      className="w-full rounded-lg border border-[#E2E2E2] px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#633CFF] focus:border-[#633CFF] cursor-pointer bg-white"
                      required
                    >
                      <option value="">Select platform</option>
                      {PLATFORMS.map(p => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

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
                        onChange={e => {
                          setUrl(e.target.value)
                          setUrlError('')
                        }}
                        className={`w-full rounded-lg border ${urlError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[#E2E2E2] focus:ring-[#633CFF] focus:border-[#633CFF]'} pl-11 pr-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 bg-white`}
                        required
                      />
                      {urlError && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-500">
                          {urlError}
                        </span>
                      )}
                    </div>
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
                  className="mx-auto w-32 lg:w-auto"
                />
                <h2 className="text-xl font-bold text-gray-900">
                  Let's get you started
                </h2>
                <p className="text-sm text-[#737373] max-w-md mx-auto leading-relaxed">
                  Use the "Add new link" button to get started. Once you have more
                  than one link, you can reorder and edit them. We're here to help
                  you share your profiles with everyone!
                </p>
              </div>
            )}

            {/* Show loading */}
            {isLoading && links.length === 0 && !showForm && (
              <div className="bg-[#FAFAFA] rounded-xl p-10 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#633CFF] mx-auto mb-4"></div>
                <p className="text-[#737373] text-sm">Loading your links...</p>
              </div>
            )}

            {/* Links list */}
            {links.length > 0 && (
              <div className="space-y-6">
                {links.map((link, index) => {
                  const platformInfo = getPlatformInfo(link.platform)
                  return (
                    <div
                      key={link.id}
                      className="bg-[#FAFAFA] rounded-xl p-5"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-gray-700 font-bold flex items-center gap-2">
                          <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                            <path d="M1 1h10M1 5h10" stroke="#737373" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          Link #{index + 1}
                        </h3>
                        <button
                          onClick={() => deleteLink.mutate({ id: link.id })}
                          disabled={deleteLink.isPending}
                          className="text-[#737373] hover:text-red-500 text-sm font-medium transition disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-700 mb-1 block">Platform</label>
                          <div className="flex items-center gap-3 w-full rounded-lg border border-[#E2E2E2] px-4 py-3 bg-white">
                            {platformInfo.icon && (
                              <img src={platformInfo.icon} alt="" className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="text-sm text-gray-900">{platformInfo.label}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-700 mb-1 block">Link</label>
                          <div className="relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <input
                              value={link.url}
                              readOnly
                              className="w-full rounded-lg border border-[#E2E2E2] pl-11 pr-3 py-3 text-sm bg-white text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* SAVE */}
            <div className="flex justify-end pt-4 border-t border-[#E2E2E2]">
              <button
                onClick={(e) => showForm && handleSubmit(e as any)}
                disabled={!showForm || createLink.isPending}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition ${
                  !showForm || createLink.isPending
                    ? 'bg-[#EFEBFF] text-[#633CFF] cursor-not-allowed opacity-50'
                    : 'bg-[#633CFF] text-white hover:opacity-90'
                }`}
              >
                {createLink.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
