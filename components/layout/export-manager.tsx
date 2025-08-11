"use client"

import { useState } from "react"
import { Download, Check, Code, Braces, Image } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useToast } from "@/hooks/use-toast"
import { useUIState } from "@/hooks/use-ui-state"
import { useMJMLProcessor } from "@/hooks/use-mjml-processor"
import { useViewport } from "@/hooks/use-viewport"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useHotkeysHandler } from "@/hooks/use-hotkeys-handler"
import { HotkeyIconButton } from "@/components/shared/hotkeys/hotkey-icon-button"
import { HotkeyDropdownItem } from "@/components/shared/hotkeys/hotkey-dropdown-item"
import { ExportOptions, ExportOption } from "@/components/export/export-options"
import { STORAGE_KEYS, UI_STATE, HOTKEYS } from "@/lib/constants"
import { copyToClipboard } from "@/lib/copy"

export function ExportManager() {
  const { content, html, vanillaHtml } = useMJMLProcessor()
  const [localLiquid] = useLocalStorage(STORAGE_KEYS.LOCAL_LIQUID, "{}")
  const [sharedLiquid] = useLocalStorage(STORAGE_KEYS.SHARED_LIQUID, "{}")
  const { toast } = useToast()
  const [exporting, setExporting] = useState(false)
  const { size } = useViewport()
  const { isOpen: isDropdownOpen, onOpenChange: onDropdownOpenChange } = useUIState(UI_STATE.EXPORT)
  const { isOpen: isExportOptionsOpen, onOpenChange: onExportOptionsChange } = useUIState(UI_STATE.HTML_EXPORT_OPTIONS)

  const handleCopy = async (data: string, type: string) => {
    await copyToClipboard(data, {
      onCopyStart: () => setExporting(true),
      onCopySuccess: () => onDropdownOpenChange(false),
      onCopyComplete: () => setExporting(false),
      toastMessage: `${type} copied to clipboard!`,
      toast,
    })
  }

  const handleCopyHTML = () => handleCopy(html, "HTML")
  const handleCopyVanillaHTML = async () => handleCopy(await vanillaHtml(), "Vanilla HTML")
  const handleCopyMJML = () => handleCopy(content, "MJML")
  const handleCopyLocalLiquid = () => handleCopy(JSON.stringify(localLiquid, null, 2), "Local Liquid")
  const handleCopySharedLiquid = () => handleCopy(JSON.stringify(sharedLiquid, null, 2), "Shared Liquid")

  const handleOpenHTMLExportOptions = () => {
    onDropdownOpenChange(false) // Close the export dropdown
    onExportOptionsChange(true) // Open the export options dialog
  }

  const htmlExportOptions: ExportOption[] = [
    {
      id: "liquid-processed-html",
      label: "Liquid Processed HTML",
      description: "This means that liquid templates will be substituted with the values you inputted in the liquid editor.",
      callback: handleCopyHTML
    },
    {
      id: "vanilla-html",
      label: "Vanilla HTML",
      description: "This means that liquid templates will not be substituted with the values you inputted in the liquid editor. This is useful if you use external tools that can consume liquid templates (e.g. Customer.io).",
      callback: handleCopyVanillaHTML
    }
  ]
  
  const handleExportImage = async () => {
    if (!html || !size) {
      toast({
        title: "Error",
        description: "Unable to export: HTML content or viewport size not available.",
        variant: "destructive",
      });
      return;
    }

    setExporting(true);
    try {
      const iframe = document.createElement("iframe");
      iframe.style.width = `${size.width}px`;
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      document.body.appendChild(iframe);

      await new Promise<void>((resolve, reject) => {
        iframe.onload = () => resolve();
        iframe.onerror = () => reject(new Error("Iframe loading failed"));
        if (iframe.contentWindow) {
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(html);
          iframe.contentWindow.document.close();
        } else {
          reject(new Error("iframe.contentWindow is null"));
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!iframe.contentWindow || !iframe.contentWindow.document.body) {
        document.body.removeChild(iframe);
        toast({
          title: "Export Error",
          description: "Failed to access iframe content for export - please record the replication steps and raise an issue on GitHub🙇‍♂ ️",
          variant: "destructive"
        });
        return;
      }
      
      const canvas = await html2canvas(iframe.contentWindow.document.body, { width: size.width });
      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL("image/png");

      const pdfWidth = canvas.width;
      const pdfHeight = canvas.height;
      const orientation = pdfWidth > pdfHeight ? "l" : "p";

      const pdf = new jsPDF({
        orientation: orientation,
        unit: "px",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("email-preview.pdf");

      toast({
        title: "Export Successful",
        description: "PDF has been downloaded!",
        variant: "success"
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during export - please record the replication steps and raise an issue on GitHub🙇‍♂ ️",
        variant: "destructive",
      });
    } finally {
      onDropdownOpenChange(false);
      setTimeout(() => {
        setExporting(false);
      }, 1000);
    }
  }
  
  useHotkeysHandler({
    hotkeys: HOTKEYS.TOGGLE_COPY.key,
    onTrigger: () => { onDropdownOpenChange(!isDropdownOpen) },
  })

  const htmlRef = useHotkeysHandler({
    hotkeys: HOTKEYS.COPY_HTML.key,
    onTrigger: () => { if (isDropdownOpen) handleOpenHTMLExportOptions() },
    dependencies: [isDropdownOpen],
    options: {
      enabled: isDropdownOpen
    }
  })
  
  const mjmlRef = useHotkeysHandler({
    hotkeys: HOTKEYS.COPY_MJML.key,
    onTrigger: () => { if (isDropdownOpen) handleCopyMJML() },
    dependencies: [isDropdownOpen, content],
    options: {
      enabled: isDropdownOpen
    }
  })

  const localRef = useHotkeysHandler({
    hotkeys: HOTKEYS.COPY_LOCAL.key,
    onTrigger: () => { if (isDropdownOpen) handleCopyLocalLiquid() },
    dependencies: [isDropdownOpen, localLiquid],
    options: {
      enabled: isDropdownOpen
    }
  })

  const sharedRef = useHotkeysHandler({
    hotkeys: HOTKEYS.COPY_SHARED.key,
    onTrigger: () => { if (isDropdownOpen) handleCopySharedLiquid() },
    dependencies: [isDropdownOpen, sharedLiquid],
    options: {
      enabled: isDropdownOpen
    }
  })

  const imageRef = useHotkeysHandler({
    hotkeys: HOTKEYS.EXPORT_IMAGE.key,
    onTrigger: () => { if (isDropdownOpen) handleExportImage() },
    dependencies: [isDropdownOpen, html],
    options: {
      enabled: isDropdownOpen
    }
  })

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={onDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <HotkeyIconButton
            icon={exporting ? <Check className="text-green-500" /> : Download}
            hotkey={HOTKEYS.TOGGLE_COPY.hint}
            srText={HOTKEYS.TOGGLE_COPY.description}
            title={HOTKEYS.TOGGLE_COPY.description}
            showHotkeyOverride={isDropdownOpen}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[220px]" align="end" ref={(el) => {
          htmlRef(el)
          mjmlRef(el)
          localRef(el)
          sharedRef(el)
          imageRef(el)
        }}>
          <HotkeyDropdownItem
            icon={Code}
            label={HOTKEYS.COPY_HTML.description}
            hotkey={HOTKEYS.COPY_HTML.hint}
            onClick={handleOpenHTMLExportOptions}
          />
          <HotkeyDropdownItem
            icon={Code}
            label={HOTKEYS.COPY_MJML.description}
            hotkey={HOTKEYS.COPY_MJML.hint}
            onClick={handleCopyMJML}
          />
          <DropdownMenuSeparator />
          <HotkeyDropdownItem
            icon={Braces}
            label={HOTKEYS.COPY_LOCAL.description}
            hotkey={HOTKEYS.COPY_LOCAL.hint}
            onClick={handleCopyLocalLiquid}
          />
          <HotkeyDropdownItem
            icon={Braces}
            label={HOTKEYS.COPY_SHARED.description}
            hotkey={HOTKEYS.COPY_SHARED.hint}
            onClick={handleCopySharedLiquid}
          />
          <DropdownMenuSeparator />
          <HotkeyDropdownItem
            icon={Image}
            label={HOTKEYS.EXPORT_IMAGE.description}
            hotkey={HOTKEYS.EXPORT_IMAGE.hint}
            onClick={handleExportImage}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ExportOptions 
        options={htmlExportOptions}
        title="HTML Export Options"
        description="Choose the HTML format you would like to copy."
        isOpen={isExportOptionsOpen}
        onOpenChange={onExportOptionsChange}
      />
    </>
  )
} 