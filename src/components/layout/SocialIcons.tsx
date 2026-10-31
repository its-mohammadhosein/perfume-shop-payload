import type { SocialLink } from '@/data/types'
import { cn } from '@/utilities/ui'

// Solid brand marks (24×24 viewBox). Lucide only ships outline versions of these.
const icons: Record<SocialLink['network'], { label: string; path: string; viewBox?: string }> = {
  facebook: {
    label: 'Facebook',
    // The "f" is narrow; crop the box so it renders at the same visual size as the others
    viewBox: '3.1 4 18 18',
    path: 'M13.5 22v-8.2h2.75l.42-3.2H13.5V8.56c0-.92.26-1.56 1.59-1.56h1.7V4.14A22.6 22.6 0 0 0 14.31 4c-2.45 0-4.12 1.5-4.12 4.24v2.36H7.42v3.2h2.77V22h3.31Z',
  },
  x: {
    label: 'X',
    path: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.25 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z',
  },
  instagram: {
    label: 'Instagram',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.31.27 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z',
  },
  youtube: {
    label: 'YouTube',
    path: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z',
  },
}

export function SocialIcons({ links, className }: { links: SocialLink[]; className?: string }) {
  return (
    <ul className={cn('flex items-center gap-4', className)}>
      {links.map(({ network, href }) => {
        const { label, path, viewBox = '0 0 24 24' } = icons[network]
        return (
          <li key={network}>
            <a
              aria-label={label}
              className="block text-white transition-colors hover:text-white/70"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox={viewBox}>
                <path d={path} />
              </svg>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
