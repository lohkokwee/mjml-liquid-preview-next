import { html as beautifyHtml } from "js-beautify";

export function formatMJML(content: string): string {
  try {
    return beautifyHtml(content, {
      indent_size: 2,
      wrap_line_length: 0,
      preserve_newlines: false,
      content_unformatted: [],
    });
  } catch {
    return content;
  }
}
