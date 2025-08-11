"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const hotkeyHintVariants = cva(
  "absolute text-[10px] font-mono bg-muted px-1 rounded",
  {
    variants: {
      variant: {
        "middle-right": "right-2",
        "bottom-right": "bottom-0 right-0"
      },
      hintColor: {
        "background": "",
        "foreground": "text-foreground"
      }
    },
    defaultVariants: {
      variant: "bottom-right",
      hintColor: "background"
    }
  }
)

interface HotkeyHintProps {
  hotkey: string
  show?: boolean
  className?: string
  variant?: VariantProps<typeof hotkeyHintVariants>["variant"]
  hintColor?: VariantProps<typeof hotkeyHintVariants>["hintColor"]
}

export function HotkeyHint({ hotkey, show = false, className = "", variant = "bottom-right", hintColor = "background" }: HotkeyHintProps) {
  if (!show) return null

  return (
    <span className={cn(hotkeyHintVariants({ variant, hintColor }), className)}>
      {hotkey}
    </span>
  )
} 