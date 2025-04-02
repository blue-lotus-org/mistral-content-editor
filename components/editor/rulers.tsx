"use client"

export default function Rulers() {
  // Generate ruler marks
  const horizontalMarks = Array.from({ length: 100 }, (_, i) => i + 1)
  const verticalMarks = Array.from({ length: 100 }, (_, i) => i + 1)

  return (
    <div className="absolute top-0 left-0 pointer-events-none">
      {/* Horizontal ruler */}
      <div className="absolute top-0 left-8 right-0 h-6 bg-gray-50 border-b border-gray-200 flex">
        {horizontalMarks.map((mark) => (
          <div key={mark} className="relative flex-shrink-0" style={{ width: "10px" }}>
            {mark % 10 === 0 && (
              <>
                <div className="absolute bottom-0 w-px h-3 bg-gray-300" style={{ left: "5px" }}></div>
                <div className="absolute bottom-3 text-[8px] text-gray-500" style={{ left: "2px" }}>
                  {mark / 10}
                </div>
              </>
            )}
            {mark % 5 === 0 && mark % 10 !== 0 && (
              <div className="absolute bottom-0 w-px h-2 bg-gray-300" style={{ left: "5px" }}></div>
            )}
            {mark % 5 !== 0 && <div className="absolute bottom-0 w-px h-1 bg-gray-300" style={{ left: "5px" }}></div>}
          </div>
        ))}
      </div>

      {/* Vertical ruler */}
      <div className="absolute top-6 left-0 bottom-0 w-8 bg-gray-50 border-r border-gray-200">
        {verticalMarks.map((mark) => (
          <div key={mark} className="relative" style={{ height: "10px" }}>
            {mark % 10 === 0 && (
              <>
                <div className="absolute right-0 h-px w-3 bg-gray-300" style={{ top: "5px" }}></div>
                <div className="absolute right-3 text-[8px] text-gray-500" style={{ top: "2px" }}>
                  {mark / 10}
                </div>
              </>
            )}
            {mark % 5 === 0 && mark % 10 !== 0 && (
              <div className="absolute right-0 h-px w-2 bg-gray-300" style={{ top: "5px" }}></div>
            )}
            {mark % 5 !== 0 && <div className="absolute right-0 h-px w-1 bg-gray-300" style={{ top: "5px" }}></div>}
          </div>
        ))}
      </div>

      {/* Corner */}
      <div className="absolute top-0 left-0 w-8 h-6 bg-gray-100 border-r border-b border-gray-200"></div>
    </div>
  )
}

