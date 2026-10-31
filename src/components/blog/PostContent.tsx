import Image from 'next/image'

import type { PostBlock } from '@/data/types'
import { cn } from '@/utilities/ui'

type FlowBlock = Exclude<PostBlock, { type: 'columns' }>

// Images and text | image rows sit 80/60/40px away from the text around them
const blockY = 'my-10 md:my-[60px] lg:my-20'

function Flow({
  block,
  prev,
  inColumn,
}: {
  block: FlowBlock
  prev?: PostBlock
  inColumn?: boolean
}) {
  switch (block.type) {
    case 'heading':
      return (
        <h2
          className={cn(
            'text-[1.6em] leading-[1.4]',
            !inColumn && 'mb-5',
            // A section straight after body text gets the block gap (source: "Final Thoughts")
            prev?.type === 'paragraph' && 'mt-10 md:mt-[60px] lg:mt-20',
          )}
        >
          {block.text}
        </h2>
      )
    case 'paragraph':
      return <p className={cn(!inColumn && 'mb-5')}>{block.text}</p>
    case 'image':
      return (
        <div className={cn(!inColumn && blockY)}>
          <Image
            alt={block.image.alt}
            className="h-auto w-full"
            height={block.image.height}
            sizes={
              inColumn ? '(min-width: 769px) 485px, 100vw' : '(min-width: 1030px) 1000px, 100vw'
            }
            src={block.image.src}
            width={block.image.width}
          />
        </div>
      )
  }
}

/** Post body: text flow with full-width images and side-by-side text | image rows. */
export function PostContent({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) =>
        block.type === 'columns' ? (
          <div key={i} className={cn('flex flex-col gap-[30px] md:flex-row', blockY)}>
            {block.columns.map((column, c) => (
              <div key={c} className="flex min-w-px flex-1 flex-col gap-5">
                {column.map((b, j) => (
                  <Flow key={j} block={b} inColumn />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <Flow key={i} block={block} prev={blocks[i - 1]} />
        ),
      )}
    </div>
  )
}
