/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      // Post bodies (journal) are rendered with `prose`; map it to the design tokens
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-body)',
            '--tw-prose-headings': 'var(--color-heading)',
            '--tw-prose-links': 'var(--color-title)',
            '--tw-prose-bold': 'var(--color-heading)',
            '--tw-prose-quotes': 'var(--color-heading)',
            '--tw-prose-bullets': 'var(--color-body)',
            maxWidth: 'none',
            fontSize: 'inherit',
            lineHeight: 1.6,
            h2: {
              fontWeight: 500,
              fontSize: '1.75rem',
              lineHeight: 1.2,
            },
            h3: {
              fontWeight: 500,
              lineHeight: 1.2,
            },
          },
        },
      },
    },
  },
}

export default config
