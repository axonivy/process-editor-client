export const focusAdjacentTabIndexMonaco = (direction: 'next' | 'previous', jumpOver?: number) => {
  if (!(document.activeElement instanceof HTMLElement)) return;

  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>('input, button, select, textarea, div[tabindex]:not([tabindex="-1"])')
  ).filter(
    el =>
      el.tagName !== 'DIV' ||
      el.classList.contains('script-input') ||
      el.classList.contains('script-area') ||
      el.classList.contains('combobox-input')
  );
  const currentElement = document.activeElement;
  const currentIndex = focusableElements.indexOf(currentElement);
  if (currentIndex === -1) return;

  const nextElement = focusableElements[currentIndex + (direction === 'next' ? 1 + (jumpOver ?? 0) : -(1 + (jumpOver ?? 0)))];

  if (nextElement) {
    nextElement.focus();
  }
};
