const isUrlRegex = /^https?:\/\/[^\s]+\.[^\s]+$/
const findUrlRegex = /https?:\/\/[^\s]+\.[^\s]+/
const isUrlLikeRegex = /^\S+\.\S+$/

export function isUrl (text: string) {
  if (!text) {
    return false
  }
  return text.match(isUrlRegex)
}

export function isUrlOrBlank (text: string) {
  return (isUrl(text) || text === '')
}

export function findUrl (text: string) {
  return text.match(findUrlRegex)
}

export function extractUrl (text: string) {
  const urlCheck = findUrl(text)
  if (!urlCheck) {
    return
  }
  const url = urlCheck[0]
  const rest = text.replace(url, '').trim()
  return {
    url, 
    rest,
  }
}

export function isUrlLike (text: string): boolean {
  return (text.search(isUrlLikeRegex) !== -1)
}
