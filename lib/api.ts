import type { Todo, SummaryResponse } from "./types"

// Base API URL
const API_BASE = "/api"

// Fetch all todos
export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_BASE}/todos`)

  if (!response.ok) {
    throw new Error("Failed to fetch todos")
  }

  return response.json()
}

// Add a new todo
export async function addTodo(todo: Omit<Todo, "id">): Promise<Todo[]> {
  const response = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })

  if (!response.ok) {
    throw new Error("Failed to add todo")
  }

  return response.json()
}

// Update a todo
export async function updateTodo(todo: Todo): Promise<Todo[]> {
  const response = await fetch(`${API_BASE}/todos/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })

  if (!response.ok) {
    throw new Error("Failed to update todo")
  }

  return response.json()
}

// Delete a todo
export async function deleteTodo(id: string): Promise<Todo[]> {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete todo")
  }

  return response.json()
}

// Summarize todos and optionally send to Slack
export async function summarizeTodos(sendToSlack: boolean): Promise<SummaryResponse> {
  const response = await fetch(`${API_BASE}/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sendToSlack }),
  })

  if (!response.ok) {
    throw new Error("Failed to summarize todos")
  }

  return response.json()
}
