"use client"

import { useHotkeys } from "react-hotkeys-hook"
import { HotkeysEvent } from "react-hotkeys-hook/dist/types"
import { useUIState } from "@/hooks/use-ui-state"
import { UI_STATE } from "@/lib/constants"

interface UseHotkeysHandlerProps {
  hotkeys: string | string[]
  uiStateKey?: keyof typeof UI_STATE
  onTrigger?: (e: KeyboardEvent, handler: HotkeysEvent) => void
  dependencies?: any[]
  options?: {
    enabled?: boolean
    enableOnFormTags?: boolean
    enableOnContentEditable?: boolean
  }
}

export function useHotkeysHandler({
  hotkeys,
  uiStateKey,
  onTrigger,
  dependencies = [],
  options = {
    enabled: true,
    enableOnFormTags: true,
    enableOnContentEditable: true
  }
}: UseHotkeysHandlerProps) {
  const { isOpen } = useUIState(uiStateKey as keyof typeof UI_STATE)
  const hotkeyDependencies = uiStateKey ? [...dependencies, isOpen] : [...dependencies]
  const mergedOptions = {
    enabled: true,
    enableOnFormTags: true,
    enableOnContentEditable: true,
    ...options
  }

  return useHotkeys(hotkeys, (e, handler) => {
    e.preventDefault()
    
    onTrigger?.(e, handler)
  }, [...hotkeyDependencies], mergedOptions)
} 