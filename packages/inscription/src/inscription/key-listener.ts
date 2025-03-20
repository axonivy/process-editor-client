import { FocusDomAction, matchesKeystroke, SetAccessibleKeyShortcutAction } from '@eclipse-glsp/client';
import { ToggleInscriptionAction } from './action';
import { injectable } from 'inversify';
import { IvyGlobalKeyListenerTool } from '@axonivy/process-editor';
import { t } from 'i18next';

@injectable()
export class IvyInscriptionGlobalKeyListenerTool extends IvyGlobalKeyListenerTool {
  registerShortcutKey(): void {
    this.actionDispatcher.onceModelInitialized().then(() => {
      this.actionDispatcher.dispatchAll([
        SetAccessibleKeyShortcutAction.create({
          token: 'Inscription',
          keys: [
            { shortcuts: ['3'], description: t('a11y.hotkeyDesc.focusInscription'), group: t('a11y.hotkeyGroup.inscription'), position: 0 }
          ]
        })
      ]);
    });
  }

  get id(): string {
    return 'glsp.global-inscription-key-listener';
  }

  protected handleKeyEvent(event: KeyboardEvent) {
    if (this.isInput(event) || !this.matchesSetFocusOnInscription(event)) {
      return [];
    }
    const selector = '#inscription-ui button';
    const focusAction = FocusDomAction.create(selector);
    if (document.querySelector<HTMLElement>(selector)?.checkVisibility()) {
      return [focusAction];
    }
    return [ToggleInscriptionAction.create({}), focusAction];
  }

  protected matchesSetFocusOnInscription(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Digit3') || matchesKeystroke(event, 'Numpad3');
  }
}
