import { useLocation, useNavigate, useParams as useRouterParams } from "react-router-dom"

export function useRouter() {
  const navigate = useNavigate()

  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: async (_href: string) => Promise.resolve(),
  }
}

export function usePathname() {
  const location = useLocation()
  return location.pathname
}

export function useParams() {
  return useRouterParams()
}
