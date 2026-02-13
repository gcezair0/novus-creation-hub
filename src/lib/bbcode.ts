/**
 * Simple BBCode parser that converts BBCode tags to HTML.
 * 
 * Supported tags:
 * [b]bold[/b]
 * [i]italic[/i]
 * [u]underline[/u]
 * [s]strikethrough[/s]
 * [url=https://...]text[/url] or [url]https://...[/url]
 * [img]https://direct-image-url[/img]
 * [color=red]text[/color]
 * [size=20]text[/size]
 * [center]text[/center]
 * [quote]text[/quote]
 * [code]text[/code]
 * [list][*]item[/list]
 * [hr]
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function parseBBCode(input: string): string {
  if (!input) return "";

  let text = escapeHtml(input);

  // Line breaks
  text = text.replace(/\n/g, "<br>");

  // Bold
  text = text.replace(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>");

  // Italic
  text = text.replace(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>");

  // Underline
  text = text.replace(/\[u\](.*?)\[\/u\]/gi, "<u>$1</u>");

  // Strikethrough
  text = text.replace(/\[s\](.*?)\[\/s\]/gi, "<del>$1</del>");

  // Horizontal rule
  text = text.replace(/\[hr\]/gi, '<hr class="my-4 border-border">');

  // Images - convert ibb.co page URLs to direct i.ibb.co URLs
  text = text.replace(
    /\[img\](.*?)\[\/img\]/gi,
    (_match, url: string) => {
      const cleanUrl = url.trim();
      return `<img src="${cleanUrl}" alt="Imagem" class="max-w-full h-auto rounded-lg my-4" loading="lazy" />`;
    }
  );

  // URL with text
  text = text.replace(
    /\[url=(.*?)\](.*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$2</a>'
  );

  // URL without text
  text = text.replace(
    /\[url\](.*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>'
  );

  // Color
  text = text.replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<span style="color:$1">$2</span>');

  // Size
  text = text.replace(/\[size=(.*?)\](.*?)\[\/size\]/gi, '<span style="font-size:$1px">$2</span>');

  // Center
  text = text.replace(/\[center\](.*?)\[\/center\]/gi, '<div class="text-center">$1</div>');

  // Quote
  text = text.replace(
    /\[quote\](.*?)\[\/quote\]/gi,
    '<blockquote class="border-l-4 border-primary/30 pl-4 py-2 my-4 italic text-muted-foreground">$1</blockquote>'
  );

  // Code
  text = text.replace(
    /\[code\](.*?)\[\/code\]/gi,
    '<code class="bg-muted px-2 py-1 rounded text-sm font-mono">$1</code>'
  );

  // List
  text = text.replace(/\[list\](.*?)\[\/list\]/gis, (_match, content: string) => {
    const items = content
      .split(/\[\*\]/)
      .filter((item) => item.trim())
      .map((item) => `<li>${item.trim()}</li>`)
      .join("");
    return `<ul class="list-disc pl-6 my-2">${items}</ul>`;
  });

  return text;
}
