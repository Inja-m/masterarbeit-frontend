import type { Notification } from "./Notification"
import type { User } from "./User"

export interface UserNotification {
	id: number
	documentId: string
	name: string
	read: boolean
	notification: Notification
	user: User
	createdAt: string
	updatedAt: string
	publishedAt: string
}