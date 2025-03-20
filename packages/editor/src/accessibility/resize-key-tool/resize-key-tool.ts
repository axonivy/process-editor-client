import {
  EnableDefaultToolsAction,
  EnableToolsAction,
  ResizeElementAction,
  ResizeKeyListener,
  ResizeKeyTool,
  ResizeType,
  SetAccessibleKeyShortcutAction,
  ShowToastMessageAction,
  type GModelElement
} from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';

@injectable()
export class IvyResizeKeyTool extends ResizeKeyTool {
  protected resizeKeyListener: ResizeKeyListener = new IvyResizeKeyListener(this);
}

@injectable()
export class IvyResizeKeyListener extends ResizeKeyListener {
  override registerShortcutKey(): void {
    this.tool.actionDispatcher.dispatchOnceModelInitialized(
      SetAccessibleKeyShortcutAction.create({
        token: this.token,
        keys: [
          {
            shortcuts: ['ALT', 'A'],
            description: t('a11y.hotkeyDesc.resizeActivate'),
            group: t('a11y.hotkeyGroup.resize'),
            position: 0
          },
          { shortcuts: ['+'], description: t('a11y.hotkeyDesc.resizeIncrease'), group: t('a11y.hotkeyGroup.resize'), position: 1 },
          { shortcuts: ['-'], description: t('a11y.hotkeyDesc.resizeDecrease'), group: t('a11y.hotkeyGroup.resize'), position: 2 },
          { shortcuts: ['CTRL', '0'], description: t('a11y.hotkeyDesc.resizeDefault'), group: t('a11y.hotkeyGroup.resize'), position: 3 }
        ]
      })
    );
  }

  override keyDown(element: GModelElement, event: KeyboardEvent) {
    const actions = [];
    const selectedElementsIds = this.tool.selectionService.getSelectedElementIDs();

    if (this.isEditMode && this.matchesDeactivateResizeModeKeystroke(event)) {
      this.isEditMode = false;

      this.tool.actionDispatcher.dispatch(
        ShowToastMessageAction.createWithTimeout({
          id: Symbol.for(ResizeKeyListener.name),
          message: t('a11y.resize.off')
        })
      );

      actions.push(EnableDefaultToolsAction.create());
    }

    if (selectedElementsIds.length > 0) {
      if (!this.isEditMode && this.matchesActivateResizeModeKeystroke(event)) {
        this.isEditMode = true;
        this.tool.actionDispatcher.dispatch(
          ShowToastMessageAction.create({
            id: Symbol.for(ResizeKeyListener.name),
            message: t('a11y.resize.on')
          })
        );
        actions.push(EnableToolsAction.create([ResizeKeyTool.ID]));
      }

      if (this.isEditMode) {
        if (this.matchesIncreaseSizeKeystroke(event)) {
          actions.push(ResizeElementAction.create(selectedElementsIds, ResizeType.Increase));
        } else if (this.matchesDecreaseSizeKeystroke(event)) {
          actions.push(ResizeElementAction.create(selectedElementsIds, ResizeType.Decrease));
        } else if (this.matchesMinSizeKeystroke(event)) {
          actions.push(ResizeElementAction.create(selectedElementsIds, ResizeType.MinSize));
        }
      }
    }
    return actions;
  }
}
