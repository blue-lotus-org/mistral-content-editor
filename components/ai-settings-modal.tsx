"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useAISettings } from "@/hooks/use-ai-settings"
import { useToast } from "@/hooks/use-toast"

interface AISettingsModalProps {
  open: boolean
  onClose: () => void
}

export default function AISettingsModal({ open, onClose }: AISettingsModalProps) {
  const { settings, updateSettings } = useAISettings()
  const [localSettings, setLocalSettings] = useState(settings)
  const { toast } = useToast()

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings, open])

  const handleSave = () => {
    // Validate API key
    if (!localSettings.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Mistral API key to use AI features",
        variant: "destructive",
      })
      return
    }

    updateSettings(localSettings)
    toast({
      title: "Settings Saved",
      description: "Your AI settings have been updated",
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
          <DialogDescription>Configure your Mistral AI settings for content generation</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={localSettings.apiKey || ""}
              onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
              placeholder="Enter your Mistral API key"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Select
              value={localSettings.model}
              onValueChange={(value) => setLocalSettings({ ...localSettings, model: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mistral-tiny">Mistral Tiny</SelectItem>
                <SelectItem value="mistral-small-latest">Mistral Small</SelectItem>
                <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
                <SelectItem value="mistral-large-latest">Mistral Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="temperature" className="text-right">
              Temperature
            </Label>
            <div className="col-span-3 flex flex-col gap-2">
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[localSettings.temperature]}
                onValueChange={(value) => setLocalSettings({ ...localSettings, temperature: value[0] })}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Precise</span>
                <span>{localSettings.temperature.toFixed(1)}</span>
                <span>Creative</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxTokens" className="text-right">
              Max Tokens
            </Label>
            <div className="col-span-3 flex flex-col gap-2">
              <Slider
                id="maxTokens"
                min={100}
                max={4000}
                step={100}
                value={[localSettings.maxTokens]}
                onValueChange={(value) => setLocalSettings({ ...localSettings, maxTokens: value[0] })}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Short</span>
                <span>{localSettings.maxTokens}</span>
                <span>Long</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

