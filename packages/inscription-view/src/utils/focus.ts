export const focusAdjacentTabIndexMonaco = (direction: 'next' | 'previous') => {
  if (!(document.activeElement instanceof HTMLElement)) return;

  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>('input, button, select, textarea, [tabindex]:not([tabindex="-1"])')
  );

  const currentElement = document.activeElement;
  const currentIndex = focusableElements.indexOf(currentElement);
  if (currentIndex === -1) return;

  //For previous, we need to go back 2 steps to ensure to jump out of monaco editor
  const nextElement = direction === 'next' ? focusableElements[currentIndex + 1] : focusableElements[currentIndex - 2];

  if (nextElement) {
    nextElement.focus();
  }
};
