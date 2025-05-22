export interface Todo {
  id: string
  title: string
  completed: boolean
  created_at?: string
}

export interface SummaryResponse {
  summary: string
  success: boolean
}
