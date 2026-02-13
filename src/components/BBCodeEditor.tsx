import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, Strikethrough, Image, Link2, Quote, List, Eye, Code } from "lucide-react";
import { parseBBCode } from "@/lib/bbcode";

interface BBCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const BBCodeEditor = ({ value, onChange }: BBCodeEditorProps) => {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = useCallback((tagOpen: string, tagClose: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newValue = `${before}${tagOpen}${selected}${tagClose}${after}`;
    onChange(newValue);

    // Restore cursor position after the inserted tag
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + tagOpen.length + selected.length + tagClose.length;
      textarea.setSelectionRange(
        selected ? cursorPos : start + tagOpen.length,
        selected ? cursorPos : start + tagOpen.length
      );
    }, 0);
  }, [value, onChange]);

  const insertTag = useCallback((tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const before = value.substring(0, start);
    const after = value.substring(start);
    onChange(`${before}${tag}${after}`);
    setTimeout(() => {
      textarea.focus();
      const pos = start + tag.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  }, [value, onChange]);

  const buttons = [
    { icon: Bold, label: "Negrito", action: () => wrapSelection("[b]", "[/b]") },
    { icon: Italic, label: "Itálico", action: () => wrapSelection("[i]", "[/i]") },
    { icon: Underline, label: "Sublinhado", action: () => wrapSelection("[u]", "[/u]") },
    { icon: Strikethrough, label: "Tachado", action: () => wrapSelection("[s]", "[/s]") },
    { icon: Image, label: "Imagem", action: () => wrapSelection("[img]", "[/img]") },
    { icon: Link2, label: "Link", action: () => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const selected = value.substring(textarea.selectionStart, textarea.selectionEnd);
      if (selected) {
        wrapSelection("[url=]", "[/url]");
      } else {
        insertTag("[url=LINK]Texto[/url]");
      }
    }},
    { icon: Quote, label: "Citação", action: () => wrapSelection("[quote]", "[/quote]") },
    { icon: List, label: "Lista", action: () => insertTag("[list]\n[*] Item 1\n[*] Item 2\n[/list]") },
    { icon: Code, label: "Código", action: () => wrapSelection("[code]", "[/code]") },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 flex-wrap bg-muted/50 p-2 rounded-t-md border border-b-0 border-border">
        {buttons.map((btn) => (
          <Button
            key={btn.label}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={btn.label}
            onClick={btn.action}
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="flex-1" />
        <Button
          type="button"
          variant={preview ? "default" : "ghost"}
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={() => setPreview(!preview)}
        >
          <Eye className="h-4 w-4" />
          {preview ? "Código" : "Visualizar"}
        </Button>
      </div>

      {preview ? (
        <div
          className="min-h-[200px] p-4 border border-border rounded-b-md bg-background prose prose-sm max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: parseBBCode(value) }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          className="rounded-t-none font-mono text-sm"
          placeholder="Use BBCode: [b]negrito[/b], [i]itálico[/i], [img]url[/img]..."
        />
      )}
    </div>
  );
};

export default BBCodeEditor;
