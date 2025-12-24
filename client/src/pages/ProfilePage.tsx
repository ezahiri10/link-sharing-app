import { useState } from 'react'
import { trpc } from '../lib/trpc'

export default function ProfilePage() {
  const { data: user } = trpc.user.me.useQuery()
  const utils = trpc.useUtils()

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate()
    },
  })

  const [firstName, setFirstName] = useState(user?.first_name ?? '')
  const [lastName, setLastName] = useState(user?.last_name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')

  if (!user) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateProfile.mutate({ firstName, lastName, email })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Profile</h1>

      <input
        placeholder="First name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />

      <input
        placeholder="Last name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button type="submit">Save</button>
    </form>
  )
}
