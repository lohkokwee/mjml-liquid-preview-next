"use client"

import { Maximize2, Minimize2 } from "lucide-react"

import { useLayout } from "@/hooks/use-layout"
import { useHotkeysHandler } from "@/hooks/use-hotkeys-handler"
import { HotkeyIconButton } from "../shared/hotkeys/hotkey-icon-button"
import { HOTKEYS } from "@/lib/constants"

export function LayoutManager() {
  const { isFullScreen, toggleFullScreen } = useLayout()

  useHotkeysHandler({
    hotkeys: HOTKEYS.TOGGLE_LAYOUT.key,
    onTrigger: () => { toggleFullScreen() }
  })

  return (
    <HotkeyIconButton
      icon={isFullScreen ? Minimize2 : Maximize2}
      hotkey={HOTKEYS.TOGGLE_LAYOUT.hint}
      srText={HOTKEYS.TOGGLE_LAYOUT.description}
      title={HOTKEYS.TOGGLE_LAYOUT.description}
      onClick={toggleFullScreen}
      className={`relative ${isFullScreen ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : ''}`}
    />
  )
} 