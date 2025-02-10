import { FocusDomAction, matchesKeystroke, SetAccessibleKeyShortcutAction } from '@eclipse-glsp/client';
import { ToggleInscriptionAction } from './action';
import { injectable } from 'inversify';
import { IvyGlobalKeyListenerTool } from '@axonivy/process-editor';

@injectable()
export class IvyInscriptionGlobalKeyListenerTool extends IvyGlobalKeyListenerTool {
  registerShortcutKey(): void {
    this.actionDispatcher.onceModelInitialized().then(() => {
      this.actionDispatcher.dispatchAll([
        SetAccessibleKeyShortcutAction.create({
          token: 'Inscription',
          keys: [{ shortcuts: ['3'], description: 'Focus on inscription', group: 'Inscription', position: 0 }]
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
