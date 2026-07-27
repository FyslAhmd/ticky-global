// Minimal, safe markdown renderer for staff-authored pages.
// Supports: ## / ### headings, **bold**, *italic*, - bullets, 1. numbered lists,
// paragraphs separated by blank lines. HTML in source is escaped.

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inline(s: string) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

export function renderMarkdown(src: string): string {
  const lines = escapeHtml(src).split('\n')
  const out: string[] = []
  let list: 'ul' | 'ol' | null = null

  const closeList = () => {
    if (list) {
      out.push(`</${list}>`)
      list = null
    }
  }

  for (const raw of lines) {
    const line = raw.trim()

    if (!line) {
      closeList()
      continue
    }

    const h3 = line.match(/^###\s+(.*)/)
    const h2 = line.match(/^##\s+(.*)/)
    const bullet = line.match(/^[-•]\s+(.*)/)
    const numbered = line.match(/^\d+[.)]\s+(.*)/)

    if (h2) {
      closeList()
      out.push(`<h2>${inline(h2[1])}</h2>`)
    } else if (h3) {
      closeList()
      out.push(`<h3>${inline(h3[1])}</h3>`)
    } else if (bullet) {
      if (list !== 'ul') {
        closeList()
        out.push('<ul>')
        list = 'ul'
      }
      out.push(`<li>${inline(bullet[1])}</li>`)
    } else if (numbered) {
      if (list !== 'ol') {
        closeList()
        out.push('<ol>')
        list = 'ol'
      }
      out.push(`<li>${inline(numbered[1])}</li>`)
    } else {
      closeList()
      out.push(`<p>${inline(line)}</p>`)
    }
  }
  closeList()
  return out.join('\n')
}
