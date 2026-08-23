const TOKEN_RE =
  /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

/**
 * Returns HTML with JSON tokens wrapped in colored spans. The input is HTML-escaped
 * first, so this is safe to render with dangerouslySetInnerHTML.
 */
export function highlightJson(json: string): string {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(TOKEN_RE, (match) => {
    let className = "text-amber-300"; // number
    if (/^"/.test(match)) {
      className = /:$/.test(match) ? "text-sky-300" : "text-emerald-300"; // key vs. string value
    } else if (match === "true" || match === "false") {
      className = "text-purple-300";
    } else if (match === "null") {
      className = "text-rose-300";
    }
    return `<span class="${className}">${match}</span>`;
  });
}
