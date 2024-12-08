"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"

interface LiquidInjectorProps {
  type: "local" | "shared"
  isOpen: boolean
  onClose: () => void
  onSave: (value: string) => void
}

export const ASCENDA_LIQUID_TEMPLATE = {
  "hide_ascenda_brand": false,
  "theme_brand_primary_color": "#22285A",
  "theme_brand_secondary_color": "#FFC0CB",
  "theme_brand_header_color": "#22285A",
  "theme_brand_header_background_color": "#FFFFFF",
  "theme_brand_header_font_family": "Lexend",
  "theme_brand_header_font_family_url": "https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap",
  "theme_brand_body_font_color": "#22285A",
  "theme_brand_body_font_family": "Lexend",
  "theme_brand_body_font_family_url": "https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap",
  "theme_brand_navigation_background_color": "#FFFFFF",
  "theme_brand_navigation_logo": "",
  "theme_brand_navigation_text_color": "#22285A",
  "theme_brand_footer_background_color": "#FFFFFF",
  "theme_brand_footer_color": "#22285A",
  "theme_brand_footer_logo": "",
  "theme_brand_brand_logo": "",
  "theme_brand_inverted_logo": "",
  "theme_brand_primary_button_border_width": "1px",
  "theme_brand_primary_button_border_radius": "4px",
  "theme_brand_secondary_button_border_width": "1px",
  "theme_brand_secondary_button_border_radius": "4px",
  "theme_brand_primary_200_color": "#c8c9d6",
  "theme_brand_secondary_200_color": "#ffeff2"
}

export function LiquidInjector({ type, isOpen, onClose, onSave }: LiquidInjectorProps) {
  const [value, setValue] = useState("")
  const storageKey = type === "local" ? "local_liquid" : "shared_liquid"

  useEffect(() => {
    if (isOpen) {
      try {
        const storedValue = localStorage.getItem(storageKey) || "{}"
        setValue(storedValue)
      } catch (e) {
        console.error("Failed to load liquid template:", e)
        setValue("{}")
      }
    }
  }, [isOpen, storageKey])

  const handleSave = () => {
    try {
      JSON.parse(value)
      onSave(value)
      onClose()
    } catch (e) {
      console.error("Invalid JSON format:", e)
    }
  }

  const handleReset = () => {
    setValue("{}")
    onSave("{}")
  }

  const handleGenerateAscenda = () => {
    const formattedValue = JSON.stringify(ASCENDA_LIQUID_TEMPLATE, null, 2)
    setValue(formattedValue)
  }

  const renderAscendaLiquidGenerateButton = () => {
    if (type === "shared") {
      return (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGenerateAscenda}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          <span className="font-sans">Generate Ascenda liquid</span>
        </Button>
      )
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{type === "local" ? "Local Liquid" : "Shared Liquid"}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {renderAscendaLiquidGenerateButton()}
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your liquid variables as JSON..."
            className="min-h-[300px] font-mono"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleReset}><span className="font-sans">Reset</span></Button>
            <Button onClick={handleSave}><span className="font-sans">Save</span></Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
