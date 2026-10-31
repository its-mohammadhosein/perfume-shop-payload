import type { FileAsset, FragranceNotes } from '@/data/types'

type ProductNotesProps = {
  notes: FragranceNotes
  /** Infobox icons for top / heart / base */
  icons: [FileAsset, FileAsset, FileAsset]
}

/** Three infoboxes: icon on top, "Top Notes:" title, list; 2px dark rule underneath. */
export function ProductNotes({ notes, icons }: ProductNotesProps) {
  const items = [
    { title: 'Top Notes:', values: notes.top, icon: icons[0] },
    { title: 'Heart Notes:', values: notes.heart, icon: icons[1] },
    { title: 'Base Notes:', values: notes.base, icon: icons[2] },
  ]

  return (
    <div className="grid gap-[30px] md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="border-b-2 border-footer pb-5">
          {/* eslint-disable-next-line @next/next/no-img-element -- small decorative SVG */}
          <img alt="" className="mb-5 size-[50px]" src={item.icon.src} />
          <h3 className="mb-2.5 text-xl md:text-2xl">{item.title}</h3>
          <p>{item.values.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}
