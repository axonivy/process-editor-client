let idCounter = 0;

export function generateId() {
  return String(idCounter++);
}

export function splitNewLine(text: string) {
  return text.split(/\r\n|\r|\n/);
}

export function splitMacroExpressions(text: string) {
  return text.split(/(<%=\s*[\s\S]*?\s*%>)/gm).filter(subtext => subtext.length > 0);
}
