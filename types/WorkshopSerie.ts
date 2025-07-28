import type { Workshop } from "./Workshop"
import type { EvaluationStep } from "./EvaluationStep"
import type { Project } from "./Project"
import type { Media } from "./Media"
import type { Team } from "./Team"
export interface WorkshopSerie {
  id: number
  documentId: string
  name: string
  description: string
	evaluation_steps: EvaluationStep[]
	project: Project
	workshops: Workshop[]
	material: Media
	team: Team
	createdAt: string
  updatedAt: string
  publishedAt: string
}
  
	