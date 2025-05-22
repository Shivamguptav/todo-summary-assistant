import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/todos - Fetch all todos
export async function GET() {
  try {
    const { data, error } = await supabase.from("todos").select("*").order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching todos:", error)
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
  }
}

// POST /api/todos - Add a new todo
export async function POST(request: Request) {
  try {
    const todo = await request.json()

    // Validate todo data
    if (!todo.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Insert todo into database
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: todo.title, completed: false }])
      .select()

    if (error) {
      throw error
    }

    // Return all todos after insertion
    const { data: allTodos, error: fetchError } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    return NextResponse.json(allTodos)
  } catch (error) {
    console.error("Error adding todo:", error)
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 })
  }
}
