export interface Media {
  id: number
  name: string
  alternativeText?: string | null
  caption?: string | null
  url: string
  mime: string
  size?: number
  width?: number
  height?: number
}