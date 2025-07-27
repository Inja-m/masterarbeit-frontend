import type { Media } from '../types/Media'

export function useImageUrl() {
  const config = useRuntimeConfig()
  const baseURL = config.public.strapiBaseUrl

  function getImageUrl(image: string | Media | null | undefined ): string {
    if (!image) return ''
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : baseURL + image
    }
    if (image.url) {
      return image.url.startsWith('http') ? image.url : baseURL + image.url
    }
    return ''
  }

  return { getImageUrl }
}