"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Editor } from "@tiptap/react"
import { Settings, FileText, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AISettingsModal from "@/components/ai-settings-modal"
import FileMenu from "@/components/file-menu"

interface HeaderProps {
  fileName: string
  setFileName: (name: string) => void
  content: string
  setContent: (content: string) => void
  editor: Editor | null
  toggleAIAssistant: () => void
  showAIToolbar: boolean
  setShowAIToolbar: (show: boolean) => void
}

export default function Header({
  fileName,
  setFileName,
  content,
  setContent,
  editor,
  toggleAIAssistant,
  showAIToolbar,
  setShowAIToolbar,
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  const fileMenuRef = useRef<HTMLDivElement>(null)

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value)
  }

  const toggleAIToolbar = () => {
    setShowAIToolbar(!showAIToolbar)
  }

  return (
    <TooltipProvider>
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <FileText className="h-6 w-6 text-blue-600" />
            <input
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              className="border-none bg-transparent font-medium focus:outline-none focus:ring-0"
            />
            <div className="relative" ref={fileMenuRef}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setShowFileMenu(!showFileMenu)}
                  >
                    File
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>File operations</p>
                </TooltipContent>
              </Tooltip>
              {showFileMenu && (
                <FileMenu
                  content={content}
                  setContent={setContent}
                  fileName={fileName}
                  setFileName={setFileName}
                  editor={editor}
                  onClose={() => setShowFileMenu(false)}
                />
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleAIAssistant}>
                  AI Sidebar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle AI assistant sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAIToolbar}
                  className={`flex items-center gap-1 ${showAIToolbar ? "bg-blue-50" : ""}`}
                >
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>AI Assist</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use AI to help with your content</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} aria-label="AI Settings">
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <AISettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      </header>
    </TooltipProvider>
  )
}

