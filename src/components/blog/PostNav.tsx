import Link from 'next/link'

import { ChevronLeft, ChevronRight, ICON_STROKE, WdIcon } from '@/components/ui/Icon'
import type { Post } from '@/data/types'
import { cn } from '@/utilities/ui'

const circle =
  'absolute top-[calc(50%-20px)] flex size-10 items-center justify-center rounded-full border border-gray-300 text-gray-800'

function NavLink({ post, dir }: { post?: Post; dir: 'newer' | 'older' }) {
  const older = dir === 'older'
  const Chevron = older ? ChevronRight : ChevronLeft
  return (
    <div className={cn('max-w-1/2 flex-[0_1_50%]', older && 'text-end')}>
      {post && (
        <Link
          className={cn(
            'group/nav relative block min-h-10',
            older ? 'pr-[55px] pl-5' : 'pr-5 pl-[55px]',
          )}
          href={`/journal/${post.slug}`}
        >
          <span className="mb-[5px] hidden text-gray-300 md:block">
            {older ? 'Older' : 'Newer'}
          </span>
          <span className="hidden font-medium text-heading transition-colors group-hover/nav:text-primary md:inline">
            {post.title}
          </span>
          <span className={cn(circle, older ? 'right-0' : 'left-0')}>
            <Chevron aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
          </span>
        </Link>
      )}
    </div>
  )
}

/** Newer | back to list | Older, between 2px dark rules. */
export function PostNav({ newer, older }: { newer?: Post; older?: Post }) {
  return (
    <nav aria-label="Post navigation" className="flex items-center border-y-2 border-primary py-5">
      <NavLink dir="newer" post={newer} />
      <Link
        aria-label="Back to list"
        className="flex size-10 shrink-0 items-center justify-center text-gray-300 hover:text-gray-900"
        href="/journal"
        title="Back to list"
      >
        <WdIcon className="size-5" name="grid" />
      </Link>
      <NavLink dir="older" post={older} />
    </nav>
  )
}
