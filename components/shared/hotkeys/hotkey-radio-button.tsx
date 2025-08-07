"use client"

import { RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { HotkeyHint } from "@/components/shared/hotkeys/hotkey-hint"
import { useKeyboard } from "@/hooks/use-keyboard"

interface HotkeyRadioButtonProps {
  id: string
  value: string
  label: string
  description: string
  hotkey: string
  onSelect?: () => void
  className?: string
}

export function HotkeyRadioButton({
  id,
  value,
  label,
  description,
  hotkey,
  onSelect,
  className = ""
}: HotkeyRadioButtonProps) {
  const { isAltPressed } = useKeyboard()

  return (
    <div className={`flex items-start space-x-3 relative ${className}`}>
      <RadioGroupItem 
        value={value} 
        id={id} 
        className="mt-1" 
        onClick={onSelect}
      />
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <Label 
            htmlFor={id}
            className="text-sm font-sans font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            onClick={onSelect}
          >
            {label}
          </Label>
          <HotkeyHint 
            hotkey={hotkey} 
            show={isAltPressed} 
            variant="middle-right"
            className="hidden sm:block"
          />
        </div>
        <p className="text-sm text-muted-foreground font-serif">
          {description}
        </p>
      </div>
    </div>
  )
} 