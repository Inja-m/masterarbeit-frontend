import type { Media } from "./Media"

export interface User {
  id: number
  username: string
  email: string
  confirmed: boolean
  blocked: boolean
  provider?: string
  role?: {
    id: number
    name: string
    description?: string
    type: string
  }
	profilepicture: Media
	phone: string
}
