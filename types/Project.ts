import type { WorkshopSerie } from "./WorkshopSerie"
export interface Project {
  id: number
  documentId: string
  name: string
	workshop_series: WorkshopSerie []
	color: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}