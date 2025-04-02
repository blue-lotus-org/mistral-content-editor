"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import FontFamily from "@tiptap/extension-font-family"
import Direction from "@/extensions/direction"
import Header from "@/components/header"
import Toolbar from "@/components/editor/toolbar"
import ContextMenu from "@/components/editor/context-menu"
import StatusBar from "@/components/editor/status-bar"
import Rulers from "@/components/editor/rulers"
import AIAssistant from "@/components/ai-assistant/ai-assistant"
import { useAISettings } from "@/hooks/use-ai-settings"
import { useMistralAI } from "@/hooks/use-mistral-ai"
import { useToast } from "@/hooks/use-toast"

export default function Editor() {
  const [content, setContent] = useState<string>("<p>Start typing or use AI to generate content...</p>")
  const [fileName, setFileName] = useState<string>("Untitled Document")
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [showAIAssistant, setShowAIAssistant] = useState(true)
  const [showAIToolbar, setShowAIToolbar] = useState(false)
  const [aiPrompt, setAIPrompt] = useState("")
  const editorRef = useRef<HTMLDivElement>(null)
  const { settings } = useAISettings()
  const { generateContent, isGenerating } = useMistralAI()
  const { toast } = useToast()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing or use AI to help you create content...",
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Direction.configure({
        types: ["heading", "paragraph"],
        defaultDirection: "ltr",
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())

      // Update word and character count
      const text = editor.getText()
      setCharCount(text.length)
      setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length)

      // Update cursor position
      const { from } = editor.state.selection
      const pos = editor.state.doc.resolve(from)
      setCursorPosition({
        line: pos.path[0] + 1,
        column: from - pos.start() + 1,
      })
    },
    onSelectionUpdate: ({ editor }) => {
      // Update cursor position on selection change
      const { from } = editor.state.selection
      const pos = editor.state.doc.resolve(from)
      setCursorPosition({
        line: pos.path[0] + 1,
        column: from - pos.start() + 1,
      })
    },
    // Fix for SSR hydration mismatch
    immediatelyRender: false,
  })

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (showContextMenu && editorRef.current && !editorRef.current.contains(e.target as Node)) {
      setShowContextMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showContextMenu])

  const handleAIAssist = async (prompt: string): Promise<string> => {
    if (!editor) return ""

    try {
      const selection = editor.state.selection
      const from = selection.from
      const to = selection.to

      const selectedText = editor.state.doc.textBetween(from, to, " ")
      const context = selectedText || content

      const generatedContent = await generateContent(prompt, context, settings)

      if (selectedText) {
        editor.commands.deleteSelection()
      }

      editor.commands.insertContent(generatedContent)
      toast({
        title: "Content generated",
        description: "AI-generated content has been inserted",
      })

      return generatedContent
    } catch (error) {
      console.error("Error in handleAIAssist:", error)
      toast({
        title: "Error",
        description: "Failed to generate content with Mistral AI",
        variant: "destructive",
      })
      throw error
    }
  }

  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant)
    // Close the toolbar AI if sidebar is opened
    if (!showAIAssistant) {
      setShowAIToolbar(false)
    }
  }

  const handleAIToolbarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (aiPrompt.trim() && !isGenerating) {
      try {
        await handleAIAssist(aiPrompt)
        setAIPrompt("")
      } catch (error) {
        console.error("Error in handleAIToolbarSubmit:", error)
        // Error is already handled in handleAIAssist
      }
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        fileName={fileName}
        setFileName={setFileName}
        content={content}
        setContent={setContent}
        editor={editor}
        toggleAIAssistant={toggleAIAssistant}
        showAIToolbar={showAIToolbar}
        setShowAIToolbar={setShowAIToolbar}
      />
      <div className="flex-1 flex">
        {showAIAssistant && <AIAssistant onAIAssist={handleAIAssist} isGenerating={isGenerating} editor={editor} />}
        <div className="flex-1 flex flex-col bg-white">
          <Toolbar
            editor={editor}
            showAIToolbar={showAIToolbar}
            aiPrompt={aiPrompt}
            setAIPrompt={setAIPrompt}
            handleAIToolbarSubmit={handleAIToolbarSubmit}
            isGenerating={isGenerating}
          />
          <div className="relative flex-1 overflow-auto">
            <Rulers />
            <div
              ref={editorRef}
              className="flex-1 overflow-auto p-8 mx-auto max-w-4xl w-full bg-white"
              onContextMenu={handleContextMenu}
            >
              <div className="min-h-[1100px] border border-gray-200 rounded-md p-8 bg-white shadow-sm">
                <EditorContent editor={editor} className="prose max-w-none min-h-[1000px]" />
              </div>
            </div>
            {showContextMenu && (
              <ContextMenu
                position={contextMenuPosition}
                editor={editor}
                onAIAssist={handleAIAssist}
                onClose={() => setShowContextMenu(false)}
              />
            )}
          </div>
          <StatusBar cursorPosition={cursorPosition} wordCount={wordCount} charCount={charCount} />
        </div>
      </div>
    </div>
  )
}



// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { useEditor, EditorContent } from "@tiptap/react"
// import StarterKit from "@tiptap/starter-kit"
// import Placeholder from "@tiptap/extension-placeholder"
// import Underline from "@tiptap/extension-underline"
// import TextAlign from "@tiptap/extension-text-align"
// import Table from "@tiptap/extension-table"
// import TableRow from "@tiptap/extension-table-row"
// import TableCell from "@tiptap/extension-table-cell"
// import TableHeader from "@tiptap/extension-table-header"
// import FontFamily from "@tiptap/extension-font-family"
// import Direction from "@/extensions/direction"
// import Header from "@/components/header"
// import Toolbar from "@/components/editor/toolbar"
// import ContextMenu from "@/components/editor/context-menu"
// import StatusBar from "@/components/editor/status-bar"
// import Rulers from "@/components/editor/rulers"
// import AIAssistant from "@/components/ai-assistant/ai-assistant"
// import { useAISettings } from "@/hooks/use-ai-settings"
// import { useMistralAI } from "@/hooks/use-mistral-ai"
// import { useToast } from "@/hooks/use-toast"

// export default function Editor() {
//   const [content, setContent] = useState<string>("<p>Start typing or use AI to generate content...</p>")
//   const [fileName, setFileName] = useState<string>("Untitled Document")
//   const [showContextMenu, setShowContextMenu] = useState(false)
//   const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
//   const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
//   const [wordCount, setWordCount] = useState(0)
//   const [charCount, setCharCount] = useState(0)
//   const [showAIAssistant, setShowAIAssistant] = useState(true)
//   const [showAIToolbar, setShowAIToolbar] = useState(false)
//   const [aiPrompt, setAIPrompt] = useState("")
//   const editorRef = useRef<HTMLDivElement>(null)
//   const { settings } = useAISettings()
//   const { generateContent, isGenerating } = useMistralAI()
//   const { toast } = useToast()


//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Placeholder.configure({
//         placeholder: "Start typing or use AI to help you create content...",
//       }),
//       Underline,
//       TextAlign.configure({
//         types: ["heading", "paragraph"],
//         alignments: ["left", "center", "right", "justify"],
//       }),
//       Direction.configure({
//         types: ["heading", "paragraph"],
//         defaultDirection: "ltr",
//       }),
//       FontFamily.configure({
//         types: ["textStyle"],
//       }),
//       Table.configure({
//         resizable: true,
//       }),
//       TableRow,
//       TableHeader,
//       TableCell,
//     ],
//     content,
//     immediatelyRender: false,
//     onUpdate: ({ editor }) => {
//       setContent(editor.getHTML())

//       // Update word and character count
//       const text = editor.getText()
//       setCharCount(text.length)
//       setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length)

//       // Update cursor position
//       const { from } = editor.state.selection
//       const pos = editor.state.doc.resolve(from)
//       setCursorPosition({
//         line: pos.path[0] + 1,
//         column: from - pos.start() + 1,
//       })
//     },
    

//     onSelectionUpdate: ({ editor }) => {
//       // Update cursor position on selection change
//       const { from } = editor.state.selection
//       const pos = editor.state.doc.resolve(from)
//       setCursorPosition({
//         line: pos.path[0] + 1,
//         column: from - pos.start() + 1,
//       })
//     },
//   })

//   const handleContextMenu = (e: React.MouseEvent) => {
//     e.preventDefault()
//     setContextMenuPosition({ x: e.clientX, y: e.clientY })
//     setShowContextMenu(true)
//   }

//   const handleClickOutside = (e: MouseEvent) => {
//     if (showContextMenu && editorRef.current && !editorRef.current.contains(e.target as Node)) {
//       setShowContextMenu(false)
//     }
//   }

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [showContextMenu])


//   const handleAIAssist = async (prompt: string): Promise<string> => {
//     if (!editor) return ""

//     try {
//       // Check for API key from settings or environment variable
//       const apiKey = settings.apiKey || process.env.MISTRAL_API_KEY

//       if (!apiKey) {
//         toast({
//           title: "API Key Missing",
//           description: "Please add your Mistral API key in the settings",
//           variant: "destructive",
//         })
//         return "Error: Please add your Mistral API key in the settings to use AI features."
//       }

//       const selection = editor.state.selection
//       const from = selection.from
//       const to = selection.to

//       const selectedText = editor.state.doc.textBetween(from, to, " ")
//       const context = selectedText || content

//       const generatedContent = await generateContent(prompt, context, settings)

//       // Only insert content if it's not an error message
//       if (!generatedContent.startsWith("Error:")) {
//         if (selectedText) {
//           editor.commands.deleteSelection()
//         }
//         editor.commands.insertContent(generatedContent)
//         toast({
//           title: "Content generated",
//           description: "AI-generated content has been inserted",
//         })
//       }

//       return generatedContent
//     } catch (error) {
//       console.error("Error in handleAIAssist:", error)
//       toast({
//         title: "Error",
//         description: "Failed to generate content with Mistral AI",
//         variant: "destructive",
//       })
//       return "Error: Failed to generate content. Please try again later."
//     }
//   }

//   const toggleAIAssistant = () => {
//     setShowAIAssistant(!showAIAssistant)
//     // Close the toolbar AI if sidebar is opened
//     if (!showAIAssistant) {
//       setShowAIToolbar(false)
//     }
//   }

//   const handleAIToolbarSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (aiPrompt.trim() && !isGenerating) {
//       try {
//         await handleAIAssist(aiPrompt)
//         setAIPrompt("")
//       } catch (error) {
//         console.error("Error in handleAIToolbarSubmit:", error)
//         // Error is already handled in handleAIAssist
//       }
//     }
//   }

//   return (
//     <div className="flex flex-col h-screen">
//       <Header
//         fileName={fileName}
//         setFileName={setFileName}
//         content={content}
//         setContent={setContent}
//         editor={editor}
//         toggleAIAssistant={toggleAIAssistant}
//         showAIToolbar={showAIToolbar}
//         setShowAIToolbar={setShowAIToolbar}
//       />
//       <div className="flex-1 flex">
//         {showAIAssistant && <AIAssistant onAIAssist={handleAIAssist} isGenerating={isGenerating} editor={editor} />}
//         <div className="flex-1 flex flex-col bg-white">
//           <Toolbar
//             editor={editor}
//             showAIToolbar={showAIToolbar}
//             aiPrompt={aiPrompt}
//             setAIPrompt={setAIPrompt}
//             handleAIToolbarSubmit={handleAIToolbarSubmit}
//             isGenerating={isGenerating}
//           />
//           <div className="relative flex-1 overflow-auto">
//             <Rulers />
//             <div
//               ref={editorRef}
//               className="flex-1 overflow-auto p-8 mx-auto max-w-4xl w-full bg-white"
//               onContextMenu={handleContextMenu}
//             >
//               <div className="min-h-[1100px] border border-gray-200 rounded-md p-8 bg-white shadow-sm">
//                 <EditorContent editor={editor} className="prose max-w-none min-h-[1000px]" />
//               </div>
//             </div>
//             {showContextMenu && (
//               <ContextMenu
//                 position={contextMenuPosition}
//                 editor={editor}
//                 onAIAssist={handleAIAssist}
//                 onClose={() => setShowContextMenu(false)}
//               />
//             )}
//           </div>
//           <StatusBar cursorPosition={cursorPosition} wordCount={wordCount} charCount={charCount} />
//         </div>
//       </div>
//     </div>
//   )
// }

