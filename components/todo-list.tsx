"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { deleteTodo, updateTodo } from "@/lib/api"
import type { Todo } from "@/lib/types"

interface TodoListProps {
  todos: Todo[]
  isLoading: boolean
  updateTodos: (todos: Todo[]) => void
}

export default function TodoList({ todos, isLoading, updateTodos }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const { toast } = useToast()

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed }
      const newTodos = await updateTodo(updatedTodo)
      updateTodos(newTodos)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const newTodos = await deleteTodo(id)
      updateTodos(newTodos)
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText("")
  }

  const saveEdit = async (todo: Todo) => {
    if (!editText.trim()) {
      toast({
        title: "Error",
        description: "Todo title cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      const updatedTodo = { ...todo, title: editText }
      const newTodos = await updateTodo(updatedTodo)
      updateTodos(newTodos)
      setEditingId(null)
      toast({
        title: "Success",
        description: "Todo updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Todos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No todos yet. Add one above!</div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo)}
                    id={`todo-${todo.id}`}
                  />

                  {editingId === todo.id ? (
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                  ) : (
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {todo.title}
                    </label>
                  )}
                </div>

                <div className="flex gap-1">
                  {editingId === todo.id ? (
                    <>
                      <Button variant="outline" size="icon" onClick={() => saveEdit(todo)} title="Save">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={cancelEditing} title="Cancel">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="icon" onClick={() => startEditing(todo)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(todo.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
