export type SeoMetadata = {
  title: string
  description: string
  canonicalUrl: string
  ogUrl: string
  ogImage: string
}

function updateMeta(selector: string, value: string) {
  const element = document.querySelector<HTMLMetaElement>(selector)
  if (element) {
    element.setAttribute('content', value)
  }
}

export function applySeoMetadata(metadata: SeoMetadata) {
  document.title = metadata.title

  updateMeta('meta[name="description"]', metadata.description)
  updateMeta('meta[property="og:title"]', metadata.title)
  updateMeta('meta[property="og:description"]', metadata.description)
  updateMeta('meta[property="og:url"]', metadata.ogUrl)
  updateMeta('meta[property="og:image"]', metadata.ogImage)
  updateMeta('meta[property="og:image:secure_url"]', metadata.ogImage)
  updateMeta('meta[name="twitter:title"]', metadata.title)
  updateMeta('meta[name="twitter:description"]', metadata.description)
  updateMeta('meta[name="twitter:image"]', metadata.ogImage)

  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', metadata.canonicalUrl)
  }
}