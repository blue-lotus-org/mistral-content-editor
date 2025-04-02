"use client"

import type React from "react"

import type { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Undo,
  Redo,
  Code,
  Quote,
  TableIcon,
  CornerDownRight,
  CornerDownLeft,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ToolbarProps {
  editor: Editor | null
  showAIToolbar: boolean
  aiPrompt: string
  setAIPrompt: (prompt: string) => void
  handleAIToolbarSubmit: (e: React.FormEvent) => void
  isGenerating: boolean
}

export default function Toolbar({
  editor,
  showAIToolbar,
  aiPrompt,
  setAIPrompt,
  handleAIToolbarSubmit,
  isGenerating,
}: ToolbarProps) {
  if (!editor) {
    return null
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

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
    // First check if there's a selection
    if (!editor.state.selection.empty) {
      // If there's a selection, apply font to the selection
      editor.chain().focus().setFontFamily(font).run()
    } else {
      // If no selection, apply font to the current position
      editor.chain().focus().setFontFamily(font).run()
    }
  }

  return (
    <TooltipProvider>
      <div className="border-b border-gray-200 bg-white p-1 sticky top-0 z-10">
        <div className="flex flex-wrap items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-gray-200" : ""}
                aria-label="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-gray-200" : ""}
                aria-label="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-gray-200" : ""}
                aria-label="Underline"
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Underline</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="Font Family">
                    <span className="text-xs">Font</span>
                  </Button>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Font Family</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="Heading">
                    <Heading1 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                    Heading 1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    Heading 2
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                    Heading 3
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>Headings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
                aria-label="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bullet List</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
                aria-label="Ordered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ordered List</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}
                aria-label="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align Left</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}
                aria-label="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align Center</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}
                aria-label="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align Right</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                className={editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""}
                aria-label="Justify"
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Justify</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setDirection("ltr").run()}
                className={editor.isActive({ dir: "ltr" }) ? "bg-gray-200" : ""}
                aria-label="Left to Right"
              >
                <CornerDownRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Left to Right</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setDirection("rtl").run()}
                className={editor.isActive({ dir: "rtl" }) ? "bg-gray-200" : ""}
                aria-label="Right to Left"
              >
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Right to Left</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive("codeBlock") ? "bg-gray-200" : ""}
                aria-label="Code Block"
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Code Block</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
                aria-label="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quote</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={insertTable} aria-label="Insert Table">
                <TableIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Insert Table</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                aria-label="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                aria-label="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {showAIToolbar && (
          <div className="mt-2 p-2 border-t border-gray-200">
            <form onSubmit={handleAIToolbarSubmit} className="flex items-center gap-2">
              <Input
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Ask Mistral AI to help with your content..."
                className="flex-grow"
                disabled={isGenerating}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" size="sm" disabled={isGenerating || !aiPrompt.trim()}>
                    {isGenerating ? "Generating..." : <Send className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate content</p>
                </TooltipContent>
              </Tooltip>
            </form>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

