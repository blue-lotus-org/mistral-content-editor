"use client"

import type { Editor } from "@tiptap/react"
import {
  Copy,
  Scissors,
  Sparkles,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CornerDownRight,
  CornerDownLeft,
  Type,
} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EditorContextMenuProps {
  position: { x: number; y: number }
  editor: Editor | null
  onAIAssist: (prompt: string) => Promise<string>
  onClose: () => void
}

export default function EditorContextMenu({ position, editor, onAIAssist, onClose }: EditorContextMenuProps) {
  const [showAIInput, setShowAIInput] = useState(false)
  const [aiPrompt, setAIPrompt] = useState("")
  const [showFontMenu, setShowFontMenu] = useState(false)

  if (!editor) return null

  const handleAISubmit = () => {
    if (aiPrompt.trim()) {
      onAIAssist(aiPrompt)
      setAIPrompt("")
      setShowAIInput(false)
      onClose()
    }
  }

  const hasSelection = !editor.state.selection.empty

  const fonts = [
    { name: "Default", value: "Inter" },
    { name: "Arial", value: "Arial" },
    { name: "Georgia", value: "Georgia" },
    { name: "Roboto", value: "Roboto" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Montserrat", value: "Montserrat" },
    { name: "Lato", value: "Lato" },
  ]

  const setFontFamily = (font: string) => {
    editor.chain().focus().setFontFamily(font).run()
    onClose()
  }

  return (
    <TooltipProvider>
      <div
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          zIndex: 50,
        }}
        className="bg-white rounded-md shadow-md border border-gray-200 w-64"
      >
        {showAIInput ? (
          <div className="p-2">
            <Input
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              placeholder="Ask Mistral AI to help..."
              className="mb-2"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowAIInput(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAISubmit} disabled={!aiPrompt.trim()}>
                Generate
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => {
                    if (hasSelection) {
                      navigator.clipboard.writeText(
                        editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, " "),
                      )
                    }
                    onClose()
                  }}
                  disabled={!hasSelection}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy selected text</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => {
                    if (hasSelection) {
                      navigator.clipboard.writeText(
                        editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, " "),
                      )
                      editor.commands.deleteSelection()
                    }
                    onClose()
                  }}
                  disabled={!hasSelection}
                >
                  <Scissors className="mr-2 h-4 w-4" />
                  <span>Cut</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cut selected text</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => {
                    navigator.clipboard.readText().then((text) => {
                      editor.commands.insertContent(text)
                    })
                    onClose()
                  }}
                >
                  <span className="mr-2">📋</span>
                  <span>Paste</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paste from clipboard</p>
              </TooltipContent>
            </Tooltip>

            <div className="my-1 h-px bg-gray-200" />

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="mr-2 h-4 w-4" />
                  <span>Bold</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Make text bold</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="mr-2 h-4 w-4" />
                  <span>Italic</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Make text italic</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <Underline className="mr-2 h-4 w-4" />
                  <span>Underline</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Underline text</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100">
                  <Type className="mr-2 h-4 w-4" />
                  <span>Font Family</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {fonts.map((font) => (
                  <DropdownMenuItem
                    key={font.value}
                    onClick={() => setFontFamily(font.value)}
                    className={editor.isActive("textStyle", { fontFamily: font.value }) ? "bg-gray-100" : ""}
                  >
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="my-1 h-px bg-gray-200" />

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => editor.chain().focus().setTextAlign("left").run()}
                >
                  <AlignLeft className="mr-2 h-4 w-4" />
                  <span>Align Left</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align text to the left</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => editor.chain().focus().setTextAlign("center").run()}
                >
                  <AlignCenter className="mr-2 h-4 w-4" />
                  <span>Align Center</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Center align text</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => editor.chain().focus().setTextAlign("right").run()}
                >
                  <AlignRight className="mr-2 h-4 w-4" />
                  <span>Align Right</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align text to the right</p>
              </TooltipContent>
            </Tooltip>

            <div className="my-1 h-px bg-gray-200" />

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => editor.chain().focus().setDirection("ltr").run()}
                >
                  <CornerDownRight className="mr-2 h-4 w-4" />
                  <span>Left to Right</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Set text direction to left-to-right</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => editor.chain().focus().setDirection("rtl").run()}
                >
                  <CornerDownLeft className="mr-2 h-4 w-4" />
                  <span>Right to Left</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Set text direction to right-to-left</p>
              </TooltipContent>
            </Tooltip>

            <div className="my-1 h-px bg-gray-200" />

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setShowAIInput(true)
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                  <span>AI Assist</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get AI assistance for your content</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

