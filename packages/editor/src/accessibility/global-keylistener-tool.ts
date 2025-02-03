import { GlobalKeyListenerTool, KeyboardToolPalette, SetAccessibleKeyShortcutAction } from '@eclipse-glsp/client';
import { matchesKeystroke } from '@eclipse-glsp/sprotty';
import { injectable } from 'inversify';

@injectable()
export class IvyGlobalKeyListenerTool extends GlobalKeyListenerTool {
  registerShortcutKey(): void {
    this.actionDispatcher.onceModelInitialized().then(() => {
      this.actionDispatcher.dispatchAll([
        SetAccessibleKeyShortcutAction.create({
          token: KeyboardToolPalette.name,
          keys: [{ shortcuts: ['CTRL', 'P'], description: 'Focus on tool palette', group: 'Tool-Palette', position: 0 }]
        }),
        SetAccessibleKeyShortcutAction.create({
          token: 'Graph',
          keys: [{ shortcuts: ['CTRL', 'G'], description: 'Focus on graph', group: 'Graph', position: 0 }]
        })
      ]);
    });
  }

  protected matchesSetFocusOnToolPalette(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'KeyP', 'ctrl');
  }
  protected matchesSetFocusOnDiagram(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'KeyG', 'ctrl');
  }
  protected matchesReleaseFocusFromToolPalette(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Escape');
  }
}
