/** `short`: "28 Oct 2025" (cards); `long`: "October 28, 2025" (single post) */
export function formatPostDate(date: string, style: 'short' | 'long' = 'short'): string {
  const d = new Date(`${date}T00:00:00Z`)
  return style === 'short'
    ? d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
}
