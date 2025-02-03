import { ElementNavigatorKeyListener, ElementNavigatorTool, matchesKeystroke, SetAccessibleKeyShortcutAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyElementNavigatorTool extends ElementNavigatorTool {
  protected elementNavigatorKeyListener: ElementNavigatorKeyListener = new IvyElementNavigatorKeyListener(this);
}

class IvyElementNavigatorKeyListener extends ElementNavigatorKeyListener {
  registerShortcutKey(): void {
    this.tool.actionDispatcher.dispatchOnceModelInitialized(
      SetAccessibleKeyShortcutAction.create({
        token: this.token,
        keys: [
          { shortcuts: ['N'], description: 'Activate default navigation', group: 'Navigation', position: 0 },
          {
            shortcuts: ['CTRL', 'N'],
            description: 'Activate position based navigation',
            group: 'Navigation',
            position: 1
          },
          {
            shortcuts: ['⬅  ⬆  ➡  ⬇'],
            description: 'Navigate by relation or neighbors according to navigation mode',
            group: 'Navigation',
            position: 2
          }
        ]
      })
    );
  }

  protected matchesActivatePositionNavigation(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'KeyN', 'ctrl');
  }
}
