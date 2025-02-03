import { AccessibleKeyShortcutTool, AccessibleShortcutKeyListener, matchesKeystroke } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyAccessibleKeyShortcutTool extends AccessibleKeyShortcutTool {
  protected shortcutKeyListener = new IvyAccessibleShortcutKeyListener();
}

class IvyAccessibleShortcutKeyListener extends AccessibleShortcutKeyListener {
  protected matchesActivateShortcutHelpKeystroke(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'KeyH');
  }
}
