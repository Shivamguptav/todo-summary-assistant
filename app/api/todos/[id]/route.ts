import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// PUT /api/todos/:id - Update a todo
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const todo = await request.json()

    // Validate todo data
    if (!todo.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Update todo in database
    const { error } = await supabase
      .from("todos")
      .update({
        title: todo.title,
        completed: todo.completed,
      })
      .eq("id", id)

    if (error) {
      throw error
    }

    // Return all todos after update
    const { data: allTodos, error: fetchError } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    return NextResponse.json(allTodos)
  } catch (error) {
    console.error("Error updating todo:", error)
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 })
  }
}

// DELETE /api/todos/:id - Delete a todo
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete todo from database
    const { error } = await supabase.from("todos").delete().eq("id", id)

    if (error) {
      throw error
    }

    // Return all todos after deletion
    const { data: allTodos, error: fetchError } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    return NextResponse.json(allTodos)
  } catch (error) {
    console.error("Error deleting todo:", error)
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 })
  }
}
