import { FocusDomAction, GlobalKeyListenerTool, KeyboardToolPalette, SetAccessibleKeyShortcutAction } from '@eclipse-glsp/client';
import { matchesKeystroke } from '@eclipse-glsp/sprotty';
import { injectable } from 'inversify';

@injectable()
export class IvyGlobalKeyListenerTool extends GlobalKeyListenerTool {
  registerShortcutKey(): void {
    this.actionDispatcher.onceModelInitialized().then(() => {
      this.actionDispatcher.dispatchAll([
        SetAccessibleKeyShortcutAction.create({
          token: KeyboardToolPalette.name,
          keys: [{ shortcuts: ['1'], description: 'Focus on tool palette', group: 'Tool-Palette', position: 0 }]
        }),
        SetAccessibleKeyShortcutAction.create({
          token: 'Graph',
          keys: [{ shortcuts: ['2'], description: 'Focus on graph', group: 'Graph', position: 0 }]
        }),
        SetAccessibleKeyShortcutAction.create({
          token: 'Inscription',
          keys: [{ shortcuts: ['3'], description: 'Focus on inscription', group: 'Inscription', position: 0 }]
        })
      ]);
    });
  }

  protected handleKeyEvent(event: KeyboardEvent) {
    if (this.matchesSetFocusOnToolPalette(event)) {
      return [FocusDomAction.create(`#btn_default_tools`)];
    }
    if (this.matchesSetFocusOnDiagram(event)) {
      return [FocusDomAction.create('graph')];
    }
    if (this.matchesSetFocusOnInscription(event)) {
      return [FocusDomAction.create('#inscription-ui button')];
    }
    return [];
  }

  protected matchesSetFocusOnToolPalette(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Digit1') || matchesKeystroke(event, 'Numpad1');
  }

  protected matchesSetFocusOnDiagram(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Digit2') || matchesKeystroke(event, 'Numpad2');
  }

  protected matchesSetFocusOnInscription(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Digit3') || matchesKeystroke(event, 'Numpad3');
  }
}
