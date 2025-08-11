"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCcw, Save, Sparkles, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { JSONEditor } from "./json-editor"
import useMJMLProcessor from "@/hooks/use-mjml-processor"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import { useHotkeysHandler } from "@/hooks/use-hotkeys-handler"
import { HotkeyIconButton } from "../shared/hotkeys/hotkey-icon-button"
import { STORAGE_KEYS, HOTKEYS, DEFAULT_LOCAL_LIQUID, DEFAULT_SHARED_LIQUID, ASCENDA_LIQUID_TEMPLATE } from "@/lib/constants"
import { HotkeyButton } from "../shared/hotkeys/hotkey-button"

interface LiquidInjectorProps {
  type: "local" | "shared"
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function LiquidInjector({ type, isOpen, onOpenChange }: LiquidInjectorProps) {
  const [value, setValue] = useState("")
  const [isExpanded, setIsExpanded] = useLocalStorage(STORAGE_KEYS.LIQUID_EXPANDED, false)
  const { toast } = useToast()
  const storageKey = type === "local" ? STORAGE_KEYS.LOCAL_LIQUID : STORAGE_KEYS.SHARED_LIQUID
  const defaultLiquid = type === "local" ? DEFAULT_LOCAL_LIQUID : DEFAULT_SHARED_LIQUID
  const [storedLiquid, setStoredLiquid] = useLocalStorage<Record<string, unknown>>(storageKey, defaultLiquid)
  const { refreshTemplate } = useMJMLProcessor()

  useEffect(() => {
    if (isOpen) {
      setValue(JSON.stringify(storedLiquid, null, 2))
    }
  }, [isOpen, storedLiquid])

  const handleSave = () => {
    try {
      const parsedValue = JSON.parse(value)
      setStoredLiquid(parsedValue)
      refreshTemplate()
      toast({
        description: `${type === "local" ? "Local" : "Shared"} Liquid saved!`,
        variant: "success",
      })
      onOpenChange(false)
    } catch {
      toast({
        description: "Invalid JSON format",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setValue(JSON.stringify(defaultLiquid, null, 2))
    toast({
      description: "Reset Liquid to empty JSON - click Save to confirm your changes",
    })
  }

  const handleGenerateAscenda = () => {
    setValue(JSON.stringify(ASCENDA_LIQUID_TEMPLATE, null, 2))
    toast({
      description: "Generated Ascenda shared Liquid template - click Save to confirm your changes",
    })
  }

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [setIsExpanded, isExpanded])

  useHotkeysHandler({
    hotkeys: HOTKEYS.LIQUID_SAVE.key,
    onTrigger: () => {
      if (isOpen) { handleSave() }
    },
    dependencies: [isOpen, handleSave],
    options: {
      enabled: isOpen
    }
  })

  useHotkeysHandler({
    hotkeys: HOTKEYS.LIQUID_RESET.key,
    onTrigger: () => {
      if (isOpen) { handleReset() }
    },
    dependencies: [isOpen, handleReset],
    options: {
      enabled: isOpen
    }
  })

  useHotkeysHandler({
    hotkeys: HOTKEYS.LIQUID_GENERATE.key,
    onTrigger: () => {
      if (isOpen && type === "shared") { handleGenerateAscenda() }
    },
    dependencies: [isOpen, type],
    options: {
      enabled: isOpen && type === "shared"
    }
  })

  useHotkeysHandler({
    hotkeys: HOTKEYS.LIQUID_EXPAND.key,
    onTrigger: () => {
      if (isOpen) { toggleExpand() }
    },
    dependencies: [isOpen, toggleExpand],
    options: {
      enabled: isOpen
    }
  })

  const renderAscendaLiquidGenerateButton = () => {
    if (type === "shared") {
      return (
        <HotkeyButton
          hotkey={HOTKEYS.LIQUID_GENERATE.hint}
          onClick={handleGenerateAscenda}
          variant="outline"
          className="w-full"
          leftIcon={Sparkles}
          tooltip={HOTKEYS.LIQUID_GENERATE.description}
        >
          {HOTKEYS.LIQUID_GENERATE.description}
        </HotkeyButton>
      )
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right"
        className={cn(
          "transition-all duration-300 sm:max-w-none",
          isExpanded ? "!w-[90vw] sm:!w-[50vw]" : "w-[400px] sm:w-[540px]"
        )}
      >
        <SheetHeader>
          <SheetTitle>{type === "local" ? "Local Liquid" : "Shared Liquid"}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {renderAscendaLiquidGenerateButton()}
          <div className="border rounded-md overflow-hidden">
            <JSONEditor
              value={value}
              onChange={setValue}
              className="min-h-[300px]"
              isExpanded={isExpanded}
            />
          </div>
          <div className="flex justify-between items-center">
            <HotkeyIconButton
              icon={isExpanded ? Minimize2 : Maximize2}
              hotkey={HOTKEYS.LIQUID_EXPAND.hint}
              srText={HOTKEYS.LIQUID_EXPAND.description}
              title={HOTKEYS.LIQUID_EXPAND.description}
              onClick={toggleExpand}
              isActive={isExpanded}
              variant="outline"
            />
            <div className="flex items-center space-x-2">
              <HotkeyButton
                hotkey={"⌫"}
                onClick={handleReset}
                variant="outline"
                leftIcon={RefreshCcw}
                tooltip="Reset to default liquid"
              >
                Reset
              </HotkeyButton>
              <HotkeyButton
                hotkey={"↩"}
                onClick={handleSave}
                variant="default"
                leftIcon={Save}
                tooltip="Save any updated liquid"
              >
                Save
              </HotkeyButton>
            </div>
          </div>
          <div className="flex justify-end items-end">
            <span className="font-serif text-sm text-muted-foreground text-right">
              Tip: hit <kbd className="px-1 py-0.5 rounded bg-muted text-xs">⌥</kbd> or <kbd className="px-1 py-0.5 rounded bg-muted text-xs">alt</kbd> to view the available hotkey combinations or <kbd className="px-1 py-0.5 rounded bg-muted text-xs">Esc</kbd> to close the sheet!
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
