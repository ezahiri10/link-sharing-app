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

  const hasLinks = links.length > 0
  const showSaveButton = showForm || hasLinks

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Fixed */}
      <header className="bg-white md:hidden border-b w-full fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard/links">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#633CFF"/>
              <path d="M11.048 18.86a3.751 3.751 0 0 1 0-5.306l1.863-1.862a.75.75 0 0 1 1.061 1.06l-1.863 1.863a2.25 2.25 0 0 0 3.182 3.182l1.862-1.862a.75.75 0 1 1 1.061 1.06l-1.862 1.863a3.756 3.756 0 0 1-5.304 0Zm9.793-7.72a3.756 3.756 0 0 0-5.304 0l-1.863 1.862a.75.75 0 0 0 1.061 1.06l1.863-1.862a2.25 2.25 0 0 1 3.182 3.182l-1.862 1.862a.75.75 0 1 0 1.06 1.06l1.863-1.862a3.756 3.756 0 0 0 0-5.303Z" fill="#FFF"/>
            </svg>
          </Link>

          <div className="flex gap-2">
            <Link 
              to="/dashboard/links"
              className="p-2.5 bg-purple-50 rounded-lg"
            >
              <svg width="20" height="20" fill="#633CFF" viewBox="0 0 16 16">
                <path d="M8.523 11.72a.75.75 0 0 1 0 1.06l-.371.371A3.751 3.751 0 1 1 2.847 7.84l1.263-1.262a.75.75 0 0 1 1.06 1.06L3.908 8.9a2.25 2.25 0 0 0 3.183 3.183l.37-.371a.75.75 0 0 1 1.062 0Zm4.63-8.874a3.756 3.756 0 0 0-5.305 0l-.371.37A.75.75 0 1 0 8.538 4.28l.37-.37a2.25 2.25 0 0 1 3.184 3.182l-1.263 1.263a.75.75 0 0 0 1.06 1.06l1.263-1.262a3.756 3.756 0 0 0 0-5.307Z"/>
              </svg>
            </Link>
            <Link 
              to="/dashboard/profile"
              className="p-2.5 rounded-lg hover:bg-purple-50"
            >
              <svg width="20" height="20" fill="#737373" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
              </svg>
            </Link>
          </div>

          <button 
            onClick={() => user?.id && window.open(`/preview/${user.id}`, '_blank')}
            className="border border-purple-600 text-purple-600 p-2.5 rounded-lg hover:bg-purple-50"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Desktop Header - Fixed */}
      <header className="bg-white hidden md:block border-b w-full fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <img 
              src="/assets/images/logo-devlinks-large.svg" 
              alt="devlinks"
              className="h-8"
            />

            <div className="flex gap-1">
              <Link 
                to="/dashboard/links"
                className="flex items-center gap-2 px-6 py-3 text-purple-600 bg-purple-50 rounded-lg font-semibold text-sm"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.523 11.72a.75.75 0 0 1 0 1.06l-.371.371A3.751 3.751 0 1 1 2.847 7.84l1.263-1.262a.75.75 0 0 1 1.06 1.06L3.908 8.9a2.25 2.25 0 0 0 3.183 3.183l.37-.371a.75.75 0 0 1 1.062 0Zm4.63-8.874a3.756 3.756 0 0 0-5.305 0l-.371.37A.75.75 0 1 0 8.538 4.28l.37-.37a2.25 2.25 0 0 1 3.184 3.182l-1.263 1.263a.75.75 0 0 0 1.06 1.06l1.263-1.262a3.756 3.756 0 0 0 0-5.307Z"/>
                </svg>
                Links
              </Link>
              <Link 
                to="/dashboard/profile"
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-purple-600 rounded-lg font-semibold text-sm"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                </svg>
                Profile Details
              </Link>
            </div>

            <button 
              onClick={() => user?.id && window.open(`/preview/${user.id}`, '_blank')}
              className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-purple-50"
            >
              Preview
            </button>
          </div>
        </div>
      </header>

      {/* Main - Mobile: full width, Desktop: max-width with padding */}
      <main className="pt-20 md:pt-24 pb-20 md:pb-0">
        <div className="md:max-w-7xl md:mx-auto md:px-6 md:py-6">
          <div className="md:grid md:grid-cols-[308px_1fr] md:gap-6">
            
            {/* Phone Preview (Desktop only) */}
            <div className="hidden md:flex justify-center items-start">
              <div className="bg-white rounded-xl p-6 w-full flex justify-center sticky top-28">
                <div className="relative">
                  <img 
                    src="/assets/images/illustration-phone-mockup.svg" 
                    alt="Phone mockup"
                    className="w-[307px] h-[631px]"
                  />
                  
                  {/* Content overlay */}
                  <div className="absolute top-[60px] left-[35px] right-[35px] bottom-[60px] flex flex-col items-center pt-12">
                    <div className="w-24 h-24 rounded-full bg-gray-200 mb-6 border-4 border-purple-600"></div>
                    <div className="w-40 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-20 h-2 bg-gray-200 rounded mb-14"></div>
                    
                    {/* Preview links */}
                    <div className="space-y-5 w-full">
                      {links.slice(0, 5).map((link) => {
                        const platformInfo = getPlatformInfo(link.platform)
                        return (
                          <div
                            key={link.id}
                            style={{ backgroundColor: platformInfo.color }}
                            className="rounded-lg p-4 flex items-center justify-between text-white shadow-sm"
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
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Editor - Mobile: no padding/margin, Desktop: card with padding */}
            <div className="bg-white md:rounded-xl md:p-10 min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-200px)]">
              
              {/* Header Section */}
              <div className="p-6 md:p-0 md:pb-10 md:mb-6 md:border-b md:border-gray-100">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Customize your links
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Add/edit/remove links below and then share all your profiles with the world!
                </p>
              </div>

              <div className="px-6 md:px-0">
                {/* Add link button */}
                <button
                  onClick={() => setShowForm(true)}
                  disabled={showForm}
                  className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-purple-50 transition disabled:opacity-50 mb-6"
                >
                  + Add new link
                </button>

                {/* Add link form */}
                {showForm && (
                  <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <div className="flex justify-between items-center mb-3">
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
                        className="text-gray-600 hover:text-red-500 text-sm font-medium transition"
                      >
                        Remove
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-700 font-normal mb-1 block">Platform</label>
                        <select
                          value={platform}
                          onChange={e => setPlatform(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 cursor-pointer"
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
                        <label className="text-xs text-gray-700 font-normal mb-1 block">Link</label>
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
                            className={`w-full rounded-lg border ${urlError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-600 focus:border-purple-600'} pl-11 pr-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1`}
                            required
                          />
                          {urlError && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-500 font-normal">
                              {urlError}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Save button inside form */}
                      <button
                        type="submit"
                        disabled={createLink.isPending}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-sm font-semibold transition disabled:opacity-50 mt-4"
                      >
                        {createLink.isPending ? 'Saving...' : 'Save'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Empty state */}
                {!isLoading && !hasLinks && !showForm && (
                  <div className="bg-gray-50 rounded-xl p-8 md:p-12 text-center flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                    <div className="max-w-md mx-auto">
                      <div className="mb-8 md:mb-10 flex justify-center">
                        <img 
                          src="/assets/images/illustration-empty.svg" 
                          alt="Get started illustration"
                          className="w-32 h-32 md:w-40 md:h-40"
                        />
                      </div>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                        Let's get you started
                      </h2>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        Use the "Add new link" button to get started. Once you have more than one link, you can reorder and edit them. We're here to help you share your profiles with everyone!
                      </p>
                    </div>
                  </div>
                )}

                {/* Show loading indicator */}
                {isLoading && !hasLinks && !showForm && (
                  <div className="bg-gray-50 rounded-xl p-10 text-center flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 text-sm md:text-base">Loading your links...</p>
                    </div>
                  </div>
                )}

                {/* Links list */}
                {hasLinks && (
                  <div className="space-y-6 pb-6 md:pb-0">
                    {links.map((link, index) => {
                      const platformInfo = getPlatformInfo(link.platform)
                      return (
                        <div
                          key={link.id}
                          className="bg-gray-50 rounded-xl p-5"
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
                              className="text-gray-600 hover:text-red-500 text-sm font-medium transition disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-gray-700 font-normal mb-1 block">Platform</label>
                              <div className="flex items-center gap-3 w-full rounded-lg border border-gray-300 px-4 py-3 bg-white">
                                {platformInfo.icon && (
                                  <img src={platformInfo.icon} alt="" className="w-4 h-4 flex-shrink-0" />
                                )}
                                <span className="text-sm text-gray-900">{platformInfo.label}</span>
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-gray-700 font-normal mb-1 block">Link</label>
                              <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <input
                                  value={link.url}
                                  readOnly
                                  className="w-full rounded-lg border border-gray-300 pl-11 pr-3 py-3 text-sm bg-white text-gray-900"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Save Button (Mobile only) */}
      {showForm && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
          <button
            onClick={(e) => handleSubmit(e as any)}
            disabled={createLink.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-base font-semibold transition disabled:opacity-50"
          >
            {createLink.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  )
}
