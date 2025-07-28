import type { Media } from "./Media"
import type { WorkshopGroup } from "./WorkshopGroup"

export interface MediaResearchQuestion {
  question: string
  subquestion?: {
    subquestion: string
  }[]
}
export interface MediaLink {
  link: string
	label: string
}
export interface MediaText {
  text: string
}
export interface MediaPictures {
  description?: string
  title?: string
  pictures?: Media[]
  Link?: MediaLink[]
}
export interface MediaPicture {
  description?: string
  picture?: Media
}

export interface MediaContext {
  text?: {
    text: string
  }[]
  link?: {
    link: string
    label?: string
  }[]
}
export interface BibliographyEntry {
  author: string;
  title: string;
  year: string | number;
}

export interface MediaTotality {
  __component: 'media.totality'
  Pictures: MediaPictures[]
	Text: MediaText[]
	workshop_group: WorkshopGroup
}

export interface MediaResearch {
  __component: 'media.research'
  title?: string
  abstract?: string
  results?: string
  disscussion?: string
  bibliography?: BibliographyEntry[]

  researchQuestion?: MediaResearchQuestion[]
  researchDesign?: MediaPicture
  context?: MediaContext
}


export type WorkshopResultBlock = MediaTotality | MediaResearch;