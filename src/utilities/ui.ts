import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge the custom type-scale utilities from globals.css. Otherwise it treats
// `text-hero` as a colour and drops it when combined with e.g. `text-white`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display', 'feature', 'hero', 'section', 'page', 'statement', 'lead'] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
