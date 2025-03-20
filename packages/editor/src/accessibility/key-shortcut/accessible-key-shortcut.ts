import { KeyShortcutUIExtension, matchesKeystroke } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import './accessible-key-shortcut.css';
import { groupBy } from './groupby';
import { t } from 'i18next';

@injectable()
export class IvyKeyShortcutUIExtension extends KeyShortcutUIExtension {
  protected refreshUI(): void {
    this.shortcutsContainer.innerHTML = '';

    const registrations = Object.values(this.registrations).flatMap(r => r);
    registrations.sort((a, b) => {
      if (a.group < b.group) {
        return -1;
      }
      if (a.group > b.group) {
        return 1;
      }

      return a.position - b.position;
    });

    const grouped = groupBy(registrations, k => k.group);

    const groupTable = document.createElement('table');
    groupTable.classList.add('shortcut-table');
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const commandCell = document.createElement('th');
    const keybindingCell = document.createElement('th');

    commandCell.classList.add('column-title');

    commandCell.innerText = t('a11y.ui.command');
    keybindingCell.innerText = t('a11y.ui.keybinding');

    headerRow.appendChild(commandCell);
    headerRow.appendChild(keybindingCell);
    tableHead.appendChild(headerRow);

    for (const [group, shortcuts] of Object.entries(grouped)) {
      tableBody.appendChild(this.createGroupHeader(group));
      shortcuts.forEach(s => {
        tableBody.appendChild(this.createEntry(s));
      });
    }

    groupTable.appendChild(tableHead);
    groupTable.appendChild(tableBody);

    this.shortcutsContainer.append(groupTable);
  }

  protected initializeContents(containerElement: HTMLElement): void {
    this.container = document.createElement('div');
    this.container.classList.add('keyboard-shortcuts-menu');

    // create title
    const menuTitle = document.createElement('h3');
    menuTitle.classList.add('menu-header');
    menuTitle.innerText = t('a11y.ui.title');
    this.container.appendChild(menuTitle);

    const closeBtn = document.createElement('button');
    closeBtn.id = 'key-shortcut-close-btn';
    closeBtn.textContent = 'x';
    closeBtn.addEventListener('click', () => {
      this.hide();
    });

    this.container.appendChild(closeBtn);

    // create shortcuts container
    this.shortcutsContainer = document.createElement('div');
    this.shortcutsContainer.classList.add('keyboard-shortcuts-container');
    this.shortcutsContainer.tabIndex = 30;
    this.shortcutsContainer.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' || matchesKeystroke(event, 'KeyH', 'alt')) {
        this.hide();
      }
    });

    this.container.appendChild(this.shortcutsContainer);
    containerElement.appendChild(this.container);
    containerElement.ariaLabel = 'Shortcut-Menu';

    this.refreshUI();
  }
}
