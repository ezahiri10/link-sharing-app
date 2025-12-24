import { useState } from 'react'
import { trpc } from '../lib/trpc'

const PLATFORMS = [
  { value: 'github', label: 'GitHub', icon: '/images/icon-github.svg' },
  { value: 'twitter', label: 'Twitter (X)', icon: '/images/icon-twitter.svg' },
  { value: 'linkedin', label: 'LinkedIn', icon: '/images/icon-linkedin.svg' },
  { value: 'facebook', label: 'Facebook', icon: '/images/icon-facebook.svg' },
  { value: 'youtube', label: 'YouTube', icon: '/images/icon-youtube.svg' },
  { value: 'twitch', label: 'Twitch', icon: '/images/icon-twitch.svg' },
  { value: 'gitlab', label: 'GitLab', icon: '/images/icon-gitlab.svg' },
  { value: 'codepen', label: 'CodePen', icon: '/images/icon-codepen.svg' },
  { value: 'codewars', label: 'Codewars', icon: '/images/icon-codewars.svg' },
  { value: 'devto', label: 'Dev.to', icon: '/images/icon-devto.svg' },
  { value: 'hashnode', label: 'Hashnode', icon: '/images/icon-hashnode.svg' },
  { value: 'stackoverflow', label: 'Stack Overflow', icon: '/images/icon-stack-overflow.svg' },
  { value: 'freecodecamp', label: 'freeCodeCamp', icon: '/images/icon-freecodecamp.svg' },
  { value: 'frontendmentor', label: 'Frontend Mentor', icon: '/images/icon-frontend-mentor.svg' },
  { value: 'email', label: 'Email', icon: '/images/icon-email.svg' },
]

export default function LinksPage() {
  const utils = trpc.useUtils()
  const { data: links, isLoading } = trpc.links.getAll.useQuery()

  const createLink = trpc.links.create.useMutation({
    onSuccess: () => {
      utils.links.getAll.invalidate()
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!platform || !url) return
    createLink.mutate({ platform, url })
    setPlatform('')
    setUrl('')
    setShowForm(false)
  }

  function getPlatformInfo(platformValue: string) {
    return PLATFORMS.find(p => p.value === platformValue) || { label: platformValue, icon: null }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading links…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: Links editor */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              Customize your links
            </h1>
            <p className="text-sm text-gray-500">
              Add, edit or remove links below and then share all your profiles with the world!
            </p>
          </div>

          {/* Add new link button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full border border-purple-600 text-purple-600
                       hover:bg-purple-50 font-medium py-2.5 rounded-lg transition"
          >
            + Add new link
          </button>

          {/* Add link form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Platform</label>
                <select
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
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

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Link</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700
                             hover:bg-gray-50 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLink.isPending}
                  className="flex-1 bg-purple-600 hover:bg-purple-700
                             text-white font-medium py-2 rounded-lg transition
                             disabled:opacity-50"
                >
                  {createLink.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}

          {/* Empty state */}
          {links?.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-3">
              <div className="text-4xl">🔗</div>
              <p className="text-gray-700 font-medium">
                Let's get you started
              </p>
              <p className="text-gray-500 text-sm">
                Use the "Add new link" button to get started. Once you have more than one link, you can reorder and edit them.
              </p>
            </div>
          )}

          {/* Links list */}
          <div className="space-y-4">
            {links?.map((link, index) => {
              const platformInfo = getPlatformInfo(link.platform)
              return (
                <div
                  key={link.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  {/* Link header */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">
                      = Link #{index + 1}
                    </p>
                    <button
                      onClick={() => deleteLink.mutate({ id: link.id })}
                      disabled={deleteLink.isPending}
                      className="text-sm text-gray-500 hover:text-red-500 transition"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Platform */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Platform
                    </label>
                    <div className="flex items-center gap-2 w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50">
                      {platformInfo.icon && (
                        <img src={platformInfo.icon} alt="" className="w-4 h-4" />
                      )}
                      <span className="text-sm text-gray-700">{platformInfo.label}</span>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Link
                    </label>
                    <input
                      value={link.url}
                      disabled
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Phone preview (desktop only) */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative">
            {/* Phone mockup SVG as background */}
            <img 
              src="/assets/images/illustration-phone-mockup.svg" 
              alt="Phone mockup"
              className="w-[308px] h-[632px]"
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center pt-16 px-8">
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
              <div className="w-40 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-20 h-2 bg-gray-200 rounded mb-8"></div>
              
              {/* Preview links */}
              <div className="space-y-3 w-full">
                {links?.slice(0, 5).map((link) => {
                  const platformInfo = getPlatformInfo(link.platform)
                  return (
                    <div
                      key={link.id}
                      className="bg-gray-200 rounded-lg p-3 flex items-center gap-2"
                    >
                      {platformInfo.icon && (
                        <img src={platformInfo.icon} alt="" className="w-4 h-4" />
                      )}
                      <span className="text-xs text-gray-700 truncate">
                        {platformInfo.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
