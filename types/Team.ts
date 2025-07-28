import type { WorkshopSerie } from "./WorkshopSerie"
import type { User } from "./User"

export interface Team {
	id: number
	documentId: string
	description: string
	workshop_serie: WorkshopSerie
	team_member: User
	workshopRole: string
	createdAt: string
	updatedAt: string
	publishedAt: string
}