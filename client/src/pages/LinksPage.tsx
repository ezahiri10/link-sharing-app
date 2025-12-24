import { useState } from 'react'
import { trpc } from '../lib/trpc'

export default function LinksPage() {
  const utils = trpc.useUtils()
  const { data: links } = trpc.links.getAll.useQuery()
  const createLink = trpc.links.create.useMutation({
    onSuccess: () => {
      utils.links.getAll.invalidate()
    },
  })

  const [platform, setPlatform] = useState('')
  const [url, setUrl] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createLink.mutate({ platform, url })
    setPlatform('')
    setUrl('')
  }

  return (
    <div>
      <h1>Your Links</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Platform"
          value={platform}
          onChange={e => setPlatform(e.target.value)}
        />

        <input
          placeholder="URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />

        <button type="submit">Add Link</button>
      </form>

      <ul>
        {links?.map(link => (
          <li key={link.id}>
            {link.platform} — {link.url}
          </li>
        ))}
      </ul>
    </div>
  )
}
