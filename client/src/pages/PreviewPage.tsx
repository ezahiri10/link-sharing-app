import { useParams } from '@tanstack/react-router'
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

export default function PreviewPage() {
  const { userId } = useParams({ from: '/preview/$userId' })
  const { data, isLoading } = trpc.user.getPublicProfile.useQuery({ userId })

  function getPlatformInfo(platformValue: string) {
    return PLATFORMS.find(p => p.value === platformValue) || { label: platformValue, icon: null }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data?.user) {
    return <div>User not found</div>
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {data.user.image && (
          <img
            src={data.user.image}
            alt={`${data.user.first_name} ${data.user.last_name}`}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '20px',
            }}
          />
        )}
        <h1>{data.user.first_name} {data.user.last_name}</h1>
      </div>

      <div>
        <h2>Links</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.links.map((link, index) => {
            const platformInfo = getPlatformInfo(link.platform)
            return (
              <li
                key={index}
                style={{
                  marginBottom: '15px',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  {platformInfo.icon && (
                    <img
                      src={platformInfo.icon}
                      alt={platformInfo.label}
                      style={{ width: '24px', height: '24px' }}
                    />
                  )}
                  <strong>{platformInfo.label}</strong>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
