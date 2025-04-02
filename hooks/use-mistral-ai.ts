"use client"

import { useState } from "react"
import type { AISettings } from "./use-ai-settings"
import { useToast } from "@/hooks/use-toast"

export function useMistralAI() {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateContent = async (prompt: string, context: string, settings: AISettings): Promise<string> => {
    setIsGenerating(true)

    try {
      // Check for API key
      const apiKey = settings.apiKey || process.env.MISTRAL_API_KEY

      if (!apiKey) {
        console.log("API Key missing. Settings:", { ...settings, apiKey: settings.apiKey ? "REDACTED" : null })
        toast({
          title: "API Key Missing",
          description: "Please add your Mistral API key in the settings",
          variant: "destructive",
        })
        setIsGenerating(false)
        return "Error: Please add your Mistral API key in the settings to use AI features."
      }

      console.log("Using API with model:", settings.model)

      // For direct integration without a backend API route
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [{ role: "user", content: `Context: ${context}\n\nTask: ${prompt}` }],
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error response:", errorData)
        throw new Error(errorData.error?.message || "Failed to generate content")
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      })
      return "Error: Failed to generate content. Please try again later."
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generateContent,
    isGenerating,
  }
}

