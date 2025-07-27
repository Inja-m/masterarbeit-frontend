import type { WorkshopSerie } from "./WorkshopSerie"
import type { WorkshopGroup } from "./WorkshopGroup"
import type { WorkshopResult } from "./WorkshopResult"
import type { UserStory } from "./UserStory"
import type { Location } from "./Location"
export interface Workshop {
  id: number
  documentId: string
  date: string
	workshop_serie: WorkshopSerie
	workshop_groups:  WorkshopGroup[]
	reward: string	
	identifier: string
	workshop_results: WorkshopResult[]
	user_stories: UserStory[]
	personalCodeExample: string
	location: Location
  createdAt: string
  updatedAt: string
  publishedAt: string
}