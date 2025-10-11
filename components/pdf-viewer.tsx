"use client"

import { useEffect, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PDFViewerProps {
  pdfUrl: string
  onClose: () => void
  title?: string
}

export function PDFViewer({ pdfUrl, onClose, title }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    // Prevent keyboard shortcuts for saving/printing
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p")) {
        e.preventDefault()
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="bg-background border-b px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold truncate">{title || "PDF Viewer"}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* PDF Container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          className="w-full h-full"
          onLoad={() => setIsLoading(false)}
          style={{
            border: "none",
          }}
          title={title || "PDF Document"}
        />
      </div>
    </div>
  )
}
