
import type { Workshop } from "./Workshop"
import type { EvaluationStep } from "./EvaluationStep"
import type { User } from "./User"
import type { WorkshopResultBlock } from "./Components"
export type EvaluationStatus = 'todo' | 'inProgress' | 'done'

export interface WorkshopResult {
  id: number
  evaluator: User
  evaluationStatus: EvaluationStatus
  evaluation_step: EvaluationStep
  Result: WorkshopResultBlock[]
  workshop: Workshop
	estimatedCompletion: string
	  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface StepResult {
  evaluationStatus: EvaluationStatus
  result: WorkshopResultBlock[]
}