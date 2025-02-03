import { matchesKeystroke } from '@eclipse-glsp/sprotty';
import { injectable } from 'inversify';
import { ResizeKeyListener, ResizeKeyTool, SetAccessibleKeyShortcutAction } from '@eclipse-glsp/client';

@injectable()
export class IvyResizeKeyTool extends ResizeKeyTool {
  protected resizeKeyListener: ResizeKeyListener = new IvyResizeKeyListener(this);
}

@injectable()
export class IvyResizeKeyListener extends ResizeKeyListener {
  protected isEditMode = false;
  protected readonly token = ResizeKeyListener.name;

  registerShortcutKey(): void {
    this.tool.actionDispatcher.dispatchOnceModelInitialized(
      SetAccessibleKeyShortcutAction.create({
        token: this.token,
        keys: [
          { shortcuts: ['R'], description: 'Activate resize mode for selected element', group: 'Resize', position: 0 },
          { shortcuts: ['ESC'], description: 'Deactivate resize mode', group: 'Resize', position: 0 },
          { shortcuts: ['+'], description: 'Increase size of element', group: 'Resize', position: 1 },
          { shortcuts: ['-'], description: 'Increase size of element', group: 'Resize', position: 2 },
          { shortcuts: ['CTRL', '0'], description: 'Set element size to default', group: 'Resize', position: 3 }
        ]
      })
    );
  }

  protected matchesActivateResizeModeKeystroke(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'KeyR');
  }
}
