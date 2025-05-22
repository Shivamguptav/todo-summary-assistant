import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"
import type { Todo } from "@/lib/types"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Slack webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

// POST /api/summarize - Summarize todos and optionally send to Slack
export async function POST(request: Request) {
  try {
    const { sendToSlack } = await request.json()

    // Fetch pending todos
    const { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .eq("completed", false)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    if (!todos || todos.length === 0) {
      return NextResponse.json({ error: "No pending todos to summarize" }, { status: 400 })
    }

    // Generate summary using OpenAI
    const summary = await generateSummary(todos)

    // Send to Slack if requested
    if (sendToSlack) {
      await sendToSlack(summary, todos.length)
    }

    return NextResponse.json({ summary, success: true })
  } catch (error) {
    console.error("Error summarizing todos:", error)
    return NextResponse.json({ error: "Failed to summarize todos" }, { status: 500 })
  }
}

// Generate summary using OpenAI
async function generateSummary(todos: Todo[]): Promise<string> {
  const todoList = todos.map((todo) => `- ${todo.title}`).join("\n")

  const prompt = `
    I have the following pending tasks:
    
    ${todoList}
    
    Please provide a concise summary of these tasks, grouping related items if possible.
    Also, suggest a priority order based on what seems most important.
  `

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant that summarizes todo lists." },
      { role: "user", content: prompt },
    ],
    max_tokens: 500,
  })

  return response.choices[0].message.content || "No summary generated."
}

// Send summary to Slack
async function sendToSlack(summary: string, todoCount: number): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    throw new Error("Slack webhook URL is not configured")
  }

  const message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📋 Todo Summary",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${todoCount} pending ${todoCount === 1 ? "task" : "tasks"}*`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: summary,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Generated on ${new Date().toLocaleString()}`,
          },
        ],
      },
    ],
  }

  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    throw new Error(`Failed to send to Slack: ${response.statusText}`)
  }
}
