import Link from 'next/link'

import type { Tag } from '@/data/types'

/** Tag pills with a small dot (WoodMart tags style 1). There are no tag archives, so they link to the journal. */
export function PostTags({ tags }: { tags: Tag[] }) {
  return (
    <ul aria-label="Tags" className="flex flex-wrap gap-2.5">
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link
            className="group/tag relative inline-flex border border-gray-300 py-[5px] pr-[15px] pl-[25px] text-[0.9em] font-semibold text-gray-900 hover:border-primary hover:text-gray-900"
            href="/journal"
          >
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-2.5 -mt-[3px] size-1.5 rounded-full bg-gray-300 transition-colors group-hover/tag:bg-primary"
            />
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
