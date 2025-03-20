import {
  isMac,
  matchesKeystroke,
  SearchAutocompletePaletteKeyListener,
  SearchAutocompletePaletteTool,
  SetAccessibleKeyShortcutAction
} from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';

@injectable()
export class IvySearchAutocompletePaletteTool extends SearchAutocompletePaletteTool {
  protected readonly keyListener: SearchAutocompletePaletteKeyListener = new IvySearchAutocompletePaletteKeyListener(this);
}

export class IvySearchAutocompletePaletteKeyListener extends SearchAutocompletePaletteKeyListener {
  registerShortcutKey(): void {
    this.tool.actionDispatcher.dispatchOnceModelInitialized(
      SetAccessibleKeyShortcutAction.create({
        token: this.token,
        keys: [
          {
            shortcuts: [isMac() ? 'CMD' : 'CTRL', 'F'],
            description: t('a11y.hotkeyDesc.searchPalette'),
            group: t('a11y.hotkeyGroup.search'),
            position: 0
          }
        ]
      })
    );
  }

  protected matchesSearchActivateKeystroke(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'KeyF', 'ctrlCmd');
  }
}
