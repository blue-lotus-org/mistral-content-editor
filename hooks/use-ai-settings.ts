"use client"

import { useState, useEffect } from "react"

export interface AISettings {
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
}

const defaultSettings: AISettings = {
  apiKey: process.env.MISTRAL_API_KEY || "",
  model: "mistral-small-latest",
  temperature: 0.7,
  maxTokens: 1000,
}

export function useAISettings() {
  const [settings, setSettings] = useState<AISettings>(defaultSettings)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem("ai-settings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        // If we have an environment variable for the API key and no saved key, use the env var
        if (!parsedSettings.apiKey && process.env.MISTRAL_API_KEY) {
          parsedSettings.apiKey = process.env.MISTRAL_API_KEY
        }
        setSettings(parsedSettings)
      } catch (error) {
        console.error("Failed to parse AI settings:", error)
      }
    } else if (process.env.MISTRAL_API_KEY) {
      // If no saved settings but we have an env var, use it
      setSettings({
        ...defaultSettings,
        apiKey: process.env.MISTRAL_API_KEY,
      })
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    // Save settings to localStorage whenever they change
    if (loaded) {
      localStorage.setItem("ai-settings", JSON.stringify(settings))
    }
  }, [settings, loaded])

  const updateSettings = (newSettings: AISettings) => {
    setSettings(newSettings)
  }

  return { settings, updateSettings }
}

