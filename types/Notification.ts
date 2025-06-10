import type { WorkshopGroup } from "./WorkshopGroup"

export interface Notification {
	id: number
	documentId: string
	workshop_groups: WorkshopGroup[]
	title: string
	message: string
	createdAt: string
	updatedAt: string
	publishedAt: string
}