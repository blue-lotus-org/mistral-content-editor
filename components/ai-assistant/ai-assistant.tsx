"use client"

import type React from "react"

import { useState } from "react"
import type { Editor } from "@tiptap/react"
import { Sparkles, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIAssistantProps {
  onAIAssist: (prompt: string) => Promise<string>
  isGenerating: boolean
  editor: Editor | null
}

export default function AIAssistant({ onAIAssist, isGenerating, editor }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [conversation, setConversation] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm your Mistral AI assistant. How can I help you with your document today?",
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return

    // Add user message to conversation
    setConversation((prev) => [...prev, { role: "user", content: prompt }])

    // Clear prompt early to give feedback
    const currentPrompt = prompt
    setPrompt("")

    try {
      // Call AI assist and get the response
      const response = await onAIAssist(currentPrompt)

      // Add assistant response to conversation
      setConversation((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error in AI assistant handleSubmit:", error)
      // Add error message to conversation
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't generate a response. Please try again.",
        },
      ])
    }
  }

  const suggestedPrompts = [
    "Summarize the selected text",
    "Improve the writing style",
    "Fix grammar and spelling",
    "Make this more concise",
    "Expand on this idea",
    "Translate to French",
    "Write template for formal letter, to investors",
    "Write template for formal letter, to employees",
    "Write template for formal letter, to customers",
    "Write template for formal letter, to suppliers",
  ]

  const handleSuggestedPrompt = (prompt: string) => {
    setPrompt(prompt)
  }

  return (
    <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <h2 className="font-medium">AI Assistant</h2>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === "user" ? "bg-blue-500 text-white ml-4" : "bg-white border border-gray-200 mr-4"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Suggested prompts:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSuggestedPrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Mistral AI..."
              className="min-h-[80px] resize-none pr-10"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-2 right-2"
              disabled={isGenerating || !prompt.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

