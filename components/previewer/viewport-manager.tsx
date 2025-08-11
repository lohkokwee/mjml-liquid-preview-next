"use client"

import { useRef, useState } from "react"
import { Monitor, Smartphone, Maximize } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useViewport } from "@/hooks/use-viewport"
import { useUIState } from "@/hooks/use-ui-state"
import { useHotkeysHandler } from "@/hooks/use-hotkeys-handler"
import { HotkeyInput } from "../shared/hotkeys/hotkey-input"
import { HotkeyIconButton } from "../shared/hotkeys/hotkey-icon-button"
import { HotkeyDropdownItem } from "../shared/hotkeys/hotkey-dropdown-item"
import { UI_STATE, HOTKEYS } from "@/lib/constants"

export const VIEWPORT_PRESETS = {
  desktop: { width: 780, height: 800 },
  mobile: { width: 375, height: 667 }
} as const

interface ViewportSize {
  width: number
  height: number
}

export function ViewportManager() {
  const { preset, setPreset, setSize } = useViewport()
  const { isOpen, onOpenChange } = useUIState(UI_STATE.VIEWPORT)
  const [customSize, setCustomSize] = useState<ViewportSize>({ width: 800, height: 600 })
  const [inputValues, setInputValues] = useState({
    width: customSize.width.toString(),
    height: customSize.height.toString()
  })
  const widthInputRef = useRef<HTMLInputElement>(null)
  const heightInputRef = useRef<HTMLInputElement>(null)

  const handlePresetChange = (newPreset: "desktop" | "mobile") => {
    setPreset(newPreset)
    const newSize = VIEWPORT_PRESETS[newPreset]
    setSize(newSize)
    setInputValues({
      width: newSize.width.toString(),
      height: newSize.height.toString()
    })
    setCustomSize(newSize)
    onOpenChange(false)
  }

  const handleCustomSizeChange = (dimension: "width" | "height", value: string) => {
    setInputValues(prev => ({ ...prev, [dimension]: value }))

    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue > 0) {
      const newSize = { ...customSize, [dimension]: numValue }
      setCustomSize(newSize)
      if (preset === "custom") {
        setSize(newSize)
      }
    }
  }

  const handleCustomSelect = () => {
    const width = parseInt(inputValues.width, 10)
    const height = parseInt(inputValues.height, 10)
    
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      const newSize = { width, height }
      setCustomSize(newSize)
      setSize(newSize)
      setPreset("custom")
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'width' | 'height') => {
    if (e.key === 'Enter') {
      handleCustomSelect()
    } else if (e.key === 'Tab' && !e.shiftKey && field === 'width') {
      e.preventDefault()
      heightInputRef.current?.focus()
    } else if (e.key === 'Tab' && e.shiftKey && field === 'height') {
      e.preventDefault()
      widthInputRef.current?.focus()
    }
  }

  useHotkeysHandler({
    hotkeys: HOTKEYS.TOGGLE_VIEWPORT.key,
    onTrigger: () => {
      onOpenChange(!isOpen)
    }
  })

  const desktopRef = useHotkeysHandler({
    hotkeys: HOTKEYS.VIEWPORT_DESKTOP.key,
    onTrigger: () => {
      if (isOpen) handlePresetChange("desktop")
    },
    dependencies: [isOpen],
    options: {
      enabled: isOpen
    }
  })
    

  const mobileRef = useHotkeysHandler({
    hotkeys: HOTKEYS.VIEWPORT_MOBILE.key,
    onTrigger: () => {
      if (isOpen) handlePresetChange("mobile")
    },
    dependencies: [isOpen],
    options: {
      enabled: isOpen
    }
  })
  

  useHotkeysHandler({
    hotkeys: HOTKEYS.VIEWPORT_WIDTH.key,
    onTrigger: () => {
      if (isOpen) {
        widthInputRef.current?.focus()
        widthInputRef.current?.select()
      }
    },
    dependencies: [isOpen],
    options: {
      enabled: isOpen
    }
  })

  useHotkeysHandler({
    hotkeys: HOTKEYS.VIEWPORT_HEIGHT.key,
    onTrigger: () => {
      if (isOpen) {
        heightInputRef.current?.focus()
        heightInputRef.current?.select()
      }
    },
    dependencies: [isOpen],
    options: {
      enabled: isOpen
    }
  })

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <HotkeyIconButton
          icon={preset === "desktop" ? Monitor : preset === "mobile" ? Smartphone : Maximize}
          hotkey={HOTKEYS.TOGGLE_VIEWPORT.hint}
          srText={HOTKEYS.TOGGLE_VIEWPORT.description}
          title={HOTKEYS.TOGGLE_VIEWPORT.description}
          showHotkeyOverride={isOpen}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]" ref={(el) => {
        desktopRef(el)
        mobileRef(el)
      }}>
        <HotkeyDropdownItem
          icon={Monitor}
          label="Desktop"
          hotkey={HOTKEYS.VIEWPORT_DESKTOP.hint}
          onClick={() => handlePresetChange("desktop")}
        />
        <HotkeyDropdownItem
          icon={Smartphone}
          label="Mobile"
          hotkey={HOTKEYS.VIEWPORT_MOBILE.hint}
          onClick={() => handlePresetChange("mobile")}
        />
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="mb-2">
            <span className="font-sans text-sm">Custom Size</span>
          </div>
          <div className="flex gap-2 mb-2">
            <div className="relative w-full">
              <HotkeyInput
                hotkey={HOTKEYS.VIEWPORT_WIDTH.hint}
                units="w"
                ref={widthInputRef}
                type="text"
                value={inputValues.width}
                onChange={(e) => handleCustomSizeChange("width", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'width')}
                className="w-full pr-6 font-sans"
              />
            </div>
            <div className="relative w-full">
              <HotkeyInput
                hotkey={HOTKEYS.VIEWPORT_HEIGHT.hint}
                units="h"
                ref={heightInputRef}
                type="text"
                value={inputValues.height}
                onChange={(e) => handleCustomSizeChange("height", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'height')}
                className="w-full pr-6 font-sans"
              />
            </div>
          </div>
          <Button 
            onClick={handleCustomSelect} 
            className="w-full"
            variant="secondary"
            size="sm"
            disabled={!inputValues.width || !inputValues.height}
          >
            <span className="font-sans">{preset === "custom" ? "Applying custom size..." : "Apply custom size"}</span>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}