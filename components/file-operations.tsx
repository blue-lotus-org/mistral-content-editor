"use client"

import type React from "react"

import { useState } from "react"
import type { Editor } from "@tiptap/react"
import { FilePlus, FolderOpen, Save, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface FileOperationsProps {
  content: string
  setContent: (content: string) => void
  fileName: string
  setFileName: (name: string) => void
  editor: Editor | null
}

export default function FileOperations({ content, setContent, fileName, setFileName, editor }: FileOperationsProps) {
  const { toast } = useToast()
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null)

  const createNewDocument = () => {
    if (editor) {
      editor.commands.clearContent()
      setFileName("Untitled Document")
      toast({
        title: "New document created",
      })
    }
  }

  const saveDocument = () => {
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Document saved",
      description: `${fileName}.html has been downloaded`,
    })
  }

  const exportAsMarkdown = () => {
    if (editor) {
      // Simple HTML to Markdown conversion
      const markdown = content
        .replace(/<h1>(.*?)<\/h1>/g, "# $1\n\n")
        .replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n")
        .replace(/<h3>(.*?)<\/h3>/g, "### $1\n\n")
        .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
        .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
        .replace(/<em>(.*?)<\/em>/g, "*$1*")
        .replace(/<u>(.*?)<\/u>/g, "_$1_")
        .replace(/<code>(.*?)<\/code>/g, "`$1`")
        .replace(/<blockquote>(.*?)<\/blockquote>/g, "> $1\n\n")
        .replace(/<ul>(.*?)<\/ul>/g, "$1\n")
        .replace(/<ol>(.*?)<\/ol>/g, "$1\n")
        .replace(/<li>(.*?)<\/li>/g, "- $1\n")
        .replace(/<br>/g, "\n")
        .replace(/<[^>]*>/g, "")

      const blob = new Blob([markdown], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Document exported",
        description: `${fileName}.md has been downloaded`,
      })
    }
  }

  const exportAsText = () => {
    if (editor) {
      const plainText = editor.getText()
      const blob = new Blob([plainText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Document exported",
        description: `${fileName}.txt has been downloaded`,
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === "string") {
        if (file.name.endsWith(".html")) {
          if (editor) {
            editor.commands.setContent(result)
          }
        } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
          if (editor) {
            editor.commands.setContent(`<p>${result.replace(/\n/g, "<br>")}</p>`)
          }
        }

        // Set filename without extension
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "")
        setFileName(nameWithoutExtension)

        toast({
          title: "File opened",
          description: `${file.name} has been loaded`,
        })
      }
    }

    if (file.name.endsWith(".html") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      reader.readAsText(file)
    } else {
      toast({
        title: "Unsupported file format",
        description: "Please upload HTML, TXT, or MD files",
        variant: "destructive",
      })
    }

    // Reset file input
    e.target.value = ""
  }

  return (
    <div className="border-r border-gray-200 p-2 flex flex-col gap-2 bg-gray-50">
      <Button variant="ghost" size="sm" className="justify-start" onClick={createNewDocument}>
        <FilePlus className="mr-2 h-4 w-4" />
        <span>New</span>
      </Button>

      <Button variant="ghost" size="sm" className="justify-start" onClick={() => fileInputRef?.click()}>
        <FolderOpen className="mr-2 h-4 w-4" />
        <span>Open</span>
      </Button>
      <input
        type="file"
        ref={(ref) => setFileInputRef(ref)}
        className="hidden"
        accept=".html,.txt,.md"
        onChange={handleFileUpload}
      />

      <Button variant="ghost" size="sm" className="justify-start" onClick={saveDocument}>
        <Save className="mr-2 h-4 w-4" />
        <span>Save</span>
      </Button>

      <div className="h-px bg-gray-200 my-1" />

      <Button variant="ghost" size="sm" className="justify-start" onClick={exportAsMarkdown}>
        <Download className="mr-2 h-4 w-4" />
        <span>Export as MD</span>
      </Button>

      <Button variant="ghost" size="sm" className="justify-start" onClick={exportAsText}>
        <FileText className="mr-2 h-4 w-4" />
        <span>Export as TXT</span>
      </Button>
    </div>
  )
}

