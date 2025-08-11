"use client"

import { Droplets, User, Users } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { LiquidInjector } from "./liquid-injector"
import { useHotkeysHandler } from "@/hooks/use-hotkeys-handler"
import { useUIState } from "@/hooks/use-ui-state"
import { HotkeyIconButton } from "../shared/hotkeys/hotkey-icon-button"
import { HotkeyDropdownItem } from "../shared/hotkeys/hotkey-dropdown-item"
import { UI_STATE, HOTKEYS } from "@/lib/constants"

export function LiquidManager() {
  const { isOpen: isManagerOpen, onOpenChange: onManagerOpenChange } = useUIState(UI_STATE.LIQUID)
  const { isOpen: isLocalOpen, onOpenChange: onLocalOpenChange } = useUIState(UI_STATE.LOCAL_LIQUID_SHEET)
  const { isOpen: isSharedOpen, onOpenChange: onSharedOpenChange } = useUIState(UI_STATE.SHARED_LIQUID_SHEET)

  useHotkeysHandler({
    hotkeys: HOTKEYS.TOGGLE_LIQUID.key,
    onTrigger: () => {
      onManagerOpenChange(!isManagerOpen)
    },
  })

  const localRef = useHotkeysHandler({
    hotkeys: HOTKEYS.LIQUID_LOCAL.key,
    onTrigger: () => {
      if (isManagerOpen) {
        onLocalOpenChange(true)
      }
    },
    dependencies: [isManagerOpen],
    options: {
      enabled: isManagerOpen
    }
  })

  const sharedRef = useHotkeysHandler({
    hotkeys: HOTKEYS.LIQUID_SHARED.key,
    onTrigger: () => {
      if (isManagerOpen) {
        onSharedOpenChange(true)
      }
    },
    dependencies: [isManagerOpen],
    options: {
      enabled: isManagerOpen
    }
  })

  return (
    <>
      <DropdownMenu open={isManagerOpen} onOpenChange={onManagerOpenChange}>
        <DropdownMenuTrigger asChild>
          <HotkeyIconButton
            icon={Droplets}
            hotkey={HOTKEYS.TOGGLE_LIQUID.hint}
            srText={HOTKEYS.TOGGLE_LIQUID.description}
            title={HOTKEYS.TOGGLE_LIQUID.description}
            showHotkeyOverride={isManagerOpen}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[180px]" align="end" ref={(el) => {
          localRef(el)
          sharedRef(el)
        }}>
          <HotkeyDropdownItem
            icon={User}
            label="Local Liquid"
            hotkey={HOTKEYS.LIQUID_LOCAL.hint}
            onClick={() => {
              onLocalOpenChange(true)
            }}
          />
          <HotkeyDropdownItem
            icon={Users}
            label="Shared Liquid"
            hotkey={HOTKEYS.LIQUID_SHARED.hint}
            onClick={() => {
              onSharedOpenChange(true)
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <LiquidInjector
        type="local"
        isOpen={isLocalOpen}
        onOpenChange={onLocalOpenChange}
      />
      <LiquidInjector
        type="shared"
        isOpen={isSharedOpen}
        onOpenChange={onSharedOpenChange}
      />
    </>
  )
} 