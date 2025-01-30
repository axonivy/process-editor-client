export const focusNewCell = (domTable: HTMLTableElement | undefined, rowIndex: number, cellType: 'input' | 'button') => {
  setTimeout(() => {
    if (!domTable) return;
    const validRows = Array.from(domTable.rows).filter(row => !row.classList.contains('ui-message-row'));
    validRows[rowIndex]?.cells[0]?.querySelector(cellType)?.focus();
  }, 0);
};
