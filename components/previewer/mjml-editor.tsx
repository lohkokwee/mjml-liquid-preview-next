"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import CodeMirrorBase, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { Save, RotateCcw, WrapText } from "lucide-react";
import { useMJMLProcessor } from "@/hooks/use-mjml-processor";
import { useHotkeys } from "react-hotkeys-hook";
import { DEFAULT_MJML, HOTKEYS, UI_STATE } from "@/lib/constants";
import { formatMJML } from "@/lib/format-mjml";
import { useUIState } from "@/hooks/use-ui-state";
import { useKeyboard } from "@/hooks/use-keyboard";

export const MJMLEditor = () => {
  const { theme } = useTheme();
  const { autoSave, setAutoSave, setContent, content, forceSave } = useMJMLProcessor();
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const { onOpenChange  } = useUIState(UI_STATE.MJML_EDITOR);
  const { isAltPressed } = useKeyboard();

  useEffect(() => {
    setEditorTheme(
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : theme === 'dark' ? 'dark' : 'light'
    );
  }, [theme]);

  const toggleAutoSave = () => {
    const newAutoSaveState = !autoSave;
    setAutoSave(newAutoSaveState);
    if (newAutoSaveState) {
      forceSave();
    }
  };

  const resetStorage = () => {
    setContent(DEFAULT_MJML);
    if (autoSave) {
      setContent(DEFAULT_MJML);
    }
  };

  const formatContent = () => setContent(formatMJML(content));

  useHotkeys(
    HOTKEYS.FOCUS_EDITOR.key,
    (e) => {
      e.preventDefault();
      onOpenChange(true);
      setTimeout(() => {
        editorRef.current?.view?.focus();
      }, 300);
    },
    { enableOnFormTags: true, enableOnContentEditable: true }
  );

  useHotkeys(
    HOTKEYS.FORMAT_MJML.key,
    (e) => {
      e.preventDefault();
      formatContent();
    },
    { enableOnFormTags: true, enableOnContentEditable: true }
  );

  return (
    <div className="relative h-full">
      <CodeMirrorBase 
        ref={editorRef}
        theme={editorTheme}
        extensions={[html()]}
        height="100%"
        className="h-full"
        value={content}
        onChange={setContent}
      />
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={formatContent}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
          title="Format MJML (alt+p)"
        >
          <WrapText className="w-4 h-4" />
          {isAltPressed && (
            <span className="absolute bottom-0 right-0 text-[10px] font-mono bg-muted px-1 rounded">
              {HOTKEYS.FORMAT_MJML.hint}
            </span>
          )}
        </button>
        <button
          onClick={resetStorage}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Reset content"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleAutoSave}
          className={`p-2 rounded-full relative ${
            autoSave
              ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
              : "bg-gray-100 dark:bg-gray-800"
          } hover:bg-opacity-80 transition-colors`}
          title="Toggle auto-save"
        >
          <Save className="w-4 h-4" />
          {autoSave && (
            <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400" />
          )}
        </button>
      </div>
    </div>
  );
}

export default MJMLEditor;
