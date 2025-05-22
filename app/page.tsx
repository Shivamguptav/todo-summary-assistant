"use client"

import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import TodoList from "@/components/todo-list"
import AddTodoForm from "@/components/add-todo-form"
import SummarySection from "@/components/summary-section"
import type { Todo } from "@/lib/types"
import { fetchTodos } from "@/lib/api"

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos()
        setTodos(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load todos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTodos()
  }, [toast])

  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos)
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Todo Summary Assistant</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <AddTodoForm updateTodos={updateTodos} />
          <TodoList todos={todos} isLoading={isLoading} updateTodos={updateTodos} />
        </div>

        <SummarySection todos={todos} />
      </div>

      <Toaster />
    </main>
  )
}
