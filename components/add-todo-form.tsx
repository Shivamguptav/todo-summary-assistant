"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addTodo } from "@/lib/api"
import type { Todo } from "@/lib/types"

interface AddTodoFormProps {
  updateTodos: (todos: Todo[]) => void
}

export default function AddTodoForm({ updateTodos }: AddTodoFormProps) {
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Todo title cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newTodos = await addTodo({ title, completed: false })
      updateTodos(newTodos)
      setTitle("")
      toast({
        title: "Success",
        description: "Todo added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Enter a new todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
