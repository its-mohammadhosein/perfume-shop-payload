import { WdIcon } from '@/components/ui/Icon'
import type { WdGlyph } from '@/components/ui/wdGlyphs'

type Network = {
  icon: WdGlyph
  label: string
  color: string
  href: (url: string, title: string, image: string) => string
}

const networks: Network[] = [
  {
    icon: 'facebook',
    label: 'Facebook',
    color: '#365493',
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  },
  { icon: 'x', label: 'X', color: '#000', href: (u) => `https://x.com/share?url=${u}` },
  {
    icon: 'pinterest',
    label: 'Pinterest',
    color: '#cb2027',
    href: (u, t, i) =>
      `https://pinterest.com/pin/create/button/?url=${u}&media=${i}&description=${t}`,
  },
  {
    icon: 'linkedin',
    label: 'Linkedin',
    color: '#0274b3',
    href: (u) => `https://www.linkedin.com/shareArticle?mini=true&url=${u}`,
  },
  {
    icon: 'telegram',
    label: 'Telegram',
    color: '#37aee2',
    href: (u) => `https://telegram.me/share/url?url=${u}`,
  },
]

type ShareButtonsProps = { url: string; title: string; image: string }

/** Share links: 40px brand-coloured circles (WoodMart social "colored", circle shape). */
export function ShareButtons({ url, title, image }: ShareButtonsProps) {
  const [u, t, i] = [url, title, image].map(encodeURIComponent) as [string, string, string]
  return (
    <ul aria-label="Share" className="flex flex-wrap items-center gap-2.5">
      {networks.map((n) => (
        <li key={n.icon}>
          <a
            aria-label={`${n.label} social link`}
            className="flex size-10 items-center justify-center rounded-full text-white hover:text-white hover:shadow-[inset_0_0_200px_rgb(0_0_0/15%)]"
            href={n.href(u, t, i)}
            rel="noopener noreferrer nofollow"
            style={{ backgroundColor: n.color }}
            target="_blank"
          >
            <WdIcon className="size-4" name={n.icon} />
          </a>
        </li>
      ))}
    </ul>
  )
}
