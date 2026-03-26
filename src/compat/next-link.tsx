import * as React from "react"
import { Link as RouterLink } from "react-router-dom"

type NextLinkProps = Omit<React.ComponentProps<typeof RouterLink>, "to" | "prefetch"> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
}

export default function Link({ href, children, prefetch: _prefetch, scroll: _scroll, shallow: _shallow, ...props }: NextLinkProps) {
  const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")

  if (isExternal) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  )
}
