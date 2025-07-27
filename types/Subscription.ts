import type { User } from "./User"
export interface Subscription {
	id: number
	documentId: string
	endpoint: string
	expirationTime: string
	user: User
	keys?: Record<string, unknown> | null 
	createdAt: string
	updatedAt: string
	publishedAt: string
}