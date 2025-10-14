"use client"

import { useEffect, useState } from "react"
import { X, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PDFViewerProps {
  pdfUrl: string
  onClose: () => void
  title?: string
}

export function PDFViewer({ pdfUrl, onClose, title }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFallback, setShowMobileFallback] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isSmallScreen = window.innerWidth < 768
      return isMobileDevice || isSmallScreen
    }

    const mobile = checkMobile()
    setIsMobile(mobile)

    // On mobile, check if iframe can load PDF, otherwise show fallback
    if (mobile) {
      const timer = setTimeout(() => {
        if (isLoading) {
          setShowMobileFallback(true)
          setIsLoading(false)
        }
      }, 3000) // If PDF doesn't load in 3 seconds on mobile, show fallback

      return () => clearTimeout(timer)
    }
  }, [isLoading])

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

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, "_blank")
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="bg-background border-b px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
        <h2 className="text-sm sm:text-lg font-semibold truncate flex-1">{title || "PDF Viewer"}</h2>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {isMobile && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenInNewTab}
                title="Yangi tabda ochish"
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-9 sm:w-9">
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {isLoading && !showMobileFallback && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">PDF yuklanmoqda...</p>
            </div>
          </div>
        )}

        {showMobileFallback ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background p-6">
            <div className="text-center space-y-4 max-w-md">
              <p className="text-lg font-medium">PDF ko'rinishi</p>
              <p className="text-sm text-muted-foreground">
                Mobil qurilmada PDF to'g'ridan-to'g'ri ko'rsatilmasligi mumkin. Yangi tabda ochish uchun quyidagi
                tugmani bosing:
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={handleOpenInNewTab} className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Yangi tabda ochish
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <object
              data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              type="application/pdf"
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
            >
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                className="w-full h-full"
                onLoad={() => setIsLoading(false)}
                style={{
                  border: "none",
                }}
                title={title || "PDF Document"}
                allow="fullscreen"
                loading="eager"
              />
            </object>
          </>
        )}
      </div>
    </div>
  )
}
