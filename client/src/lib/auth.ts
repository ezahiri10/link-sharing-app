import { trpc } from './trpc'

export function useAuthUser() {
  return trpc.user.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })
}