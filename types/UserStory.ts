import type { Workshop } from "./Workshop"
import type { User } from "./User"
import type { MediaPictures } from "./Components"
export type DevelopmentStatus = 'todo' | 'inProgress' | 'done'

export interface UserStory {
	id: number
	documentId: string
	role: string
	goal: string
	benefit:string
	workshop:Workshop
	user: User
	developmentStatus: DevelopmentStatus
	result: MediaPictures
	createdAt: string
	updatedAt: string
	publishedAt: string
}