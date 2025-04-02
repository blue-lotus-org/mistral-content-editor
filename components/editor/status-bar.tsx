"use client"

interface StatusBarProps {
  cursorPosition: { line: number; column: number }
  wordCount: number
  charCount: number
}

export default function StatusBar({ cursorPosition, wordCount, charCount }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1 text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center gap-6">
        <span>
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </span>
        <span>Words: {wordCount}</span>
        <span>Chars: {charCount}</span>
      </div>
      <div>
        <span>100%</span>
      </div>
    </div>
  )
}

