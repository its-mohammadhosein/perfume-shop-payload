import Link from 'next/link'

import { User } from '@/components/ui/Icon'

/**
 * "About {author}" box: centred, light grey background. Payload users have only a name, so the
 * bio paragraph shows only when one is passed.
 */
export function AuthorBio({ author }: { author: { name: string; bio?: string } }) {
  return (
    <div className="flex flex-col items-center gap-[15px] bg-black/4 p-[25px] text-center">
      {/* The source shows Gravatar's default "mystery person" (not mirrored) */}
      <span
        aria-hidden="true"
        className="flex size-[74px] items-end justify-center overflow-hidden rounded-full bg-[#c5c5c5] text-white"
      >
        <User className="-mb-2 size-[62px]" fill="currentColor" strokeWidth={0} />
      </span>
      <h4 className="text-lg leading-[1.4]">About {author.name}</h4>
      {author.bio && <p>{author.bio}</p>}
      <Link className="font-semibold" href="/journal">
        View all posts by {author.name}
      </Link>
    </div>
  )
}
