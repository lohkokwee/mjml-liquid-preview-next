"use client"

import { HelpCircle } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"

import { useUIState } from "@/hooks/use-ui-state"
import { HotkeyIconButton } from "@/components/shared/hotkeys/hotkey-icon-button"
import { UI_STATE, HOTKEYS, STANDARD_HOTKEYS } from "@/lib/constants"

export function HelpDialog() {
  const { isOpen, onOpenChange } = useUIState(UI_STATE.HELP)

  useHotkeys(HOTKEYS.TOGGLE_HELP.key, (e) => {
    e.preventDefault()
    onOpenChange(!isOpen)
  }, { enableOnFormTags: true, enableOnContentEditable: true })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <span className="font-sans text-xl">Keyboard Shortcuts</span>
          </DialogTitle>
          <DialogDescription>
            <span className="font-sans text-sm text-muted-foreground">
              Hitting <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">alt</kbd> opens up mini keywords beside the various buttons to help you navigate the app.
              I hope you find using this as fun as it was to build!
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {STANDARD_HOTKEYS.map((section) => (
            <div key={section.title}>
              <h3 className="font-sans text-lg font-semibold mb-2">{section.title}</h3>
              <div className="space-y-2">
                {section.hotkeys.map((hotkey) => (
                  <div key={hotkey.key} className="flex items-center justify-between">
                    <span className="font-sans text-sm text-muted-foreground">{hotkey.description}</span>
                    <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">
                      {hotkey.key.replace(/\+/g, ' + ')}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function HelpButton() {
  const { onOpenChange } = useUIState(UI_STATE.HELP)

  return (
    <HotkeyIconButton
      icon={HelpCircle}
      hotkey={HOTKEYS.TOGGLE_HELP.hint}
      srText={HOTKEYS.TOGGLE_HELP.description}
      title={HOTKEYS.TOGGLE_HELP.description}
      onClick={() => onOpenChange(true)}
      className="relative"
    />
  )
} 