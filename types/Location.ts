import type { Media } from "./Media"
export interface Location {
  id?: number
	documentId: string      
  name: string
  floorPlan?: Media | null   
  maps: string
  personNumber: number
  material: string           
  directions: string         
  publishedAt?: string 
  createdAt?: string
  updatedAt?: string
}