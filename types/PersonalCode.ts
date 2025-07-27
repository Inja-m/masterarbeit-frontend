import type { WorkshopGroup } from "./WorkshopGroup"
export interface PersonalCode {
	id?: number
	documentId: string      
	code: string
	workshop_group: WorkshopGroup
	withdraw: boolean     
	publishedAt?: string 
	createdAt?: string
	updatedAt?: string
}