//convert string with newlines to HTML

export function convertToHTML(text: string | null) {
  if (!text) return '';
  return text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
}
