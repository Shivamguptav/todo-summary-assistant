"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"
import { summarizeTodos } from "@/lib/api"
import type { Todo } from "@/lib/types"

interface SummarySectionProps {
  todos: Todo[]
}

export default function SummarySection({ todos }: SummarySectionProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const pendingTodos = todos.filter((todo) => !todo.completed)

  const handleGenerateSummary = async () => {
    if (pendingTodos.length === 0) {
      toast({
        title: "No pending todos",
        description: "There are no pending todos to summarize",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const result = await summarizeTodos(false)
      setSummary(result.summary)
      toast({
        title: "Success",
        description: "Summary generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendToSlack = async () => {
    if (!summary) {
      toast({
        title: "No summary",
        description: "Please generate a summary first",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      await summarizeTodos(true)
      toast({
        title: "Success",
        description: "Summary sent to Slack successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send summary to Slack",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Todo Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleGenerateSummary}
            disabled={isGenerating || pendingTodos.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Summary"
            )}
          </Button>

          <Button onClick={handleSendToSlack} disabled={isSending || !summary} variant="outline" className="w-full">
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send to Slack
              </>
            )}
          </Button>
        </div>

        {summary && (
          <div className="mt-4 p-3 border rounded-md bg-muted">
            <h3 className="font-medium mb-2">Generated Summary:</h3>
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          {pendingTodos.length === 0
            ? "No pending todos to summarize"
            : `${pendingTodos.length} pending ${pendingTodos.length === 1 ? "todo" : "todos"} to summarize`}
        </div>
      </CardContent>
    </Card>
  )
}
