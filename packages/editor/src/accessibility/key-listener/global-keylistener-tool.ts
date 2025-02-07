import { FocusDomAction, GlobalKeyListenerTool, KeyboardToolPalette, SetAccessibleKeyShortcutAction } from '@eclipse-glsp/client';
import { Action, matchesKeystroke } from '@eclipse-glsp/sprotty';
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
        })
      ]);
    });
  }

  protected handleKeyEvent(event: KeyboardEvent): Action[] {
    if (this.isInput(event)) {
      return [];
    }
    if (this.matchesSetFocusOnToolPalette(event)) {
      return [FocusDomAction.create(`#btn_default_tools`)];
    }
    if (this.matchesSetFocusOnDiagram(event)) {
      return [FocusDomAction.create(`#${document.querySelector('svg.sprotty-graph')?.parentElement?.id}`)];
    }
    return [];
  }

  protected isInput(event: KeyboardEvent) {
    return event.target instanceof HTMLInputElement;
  }

  protected matchesSetFocusOnToolPalette(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Digit1') || matchesKeystroke(event, 'Numpad1');
  }

  protected matchesSetFocusOnDiagram(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Digit2') || matchesKeystroke(event, 'Numpad2');
  }
}
