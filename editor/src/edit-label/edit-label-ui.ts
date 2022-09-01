import { Action, EditLabelUI, IActionHandler, ICommand, isEditLabelAction, SetUIExtensionVisibilityAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyEditLabelActionHandler implements IActionHandler {
  handle(action: Action): void | Action | ICommand {
    if (isEditLabelAction(action)) {
      return SetUIExtensionVisibilityAction.create({
        extensionId: IvyEditLabelUI.IVY_ID,
        visible: true,
        contextElementsId: [action.labelId]
      });
    }
  }
}

@injectable()
export class IvyEditLabelUI extends EditLabelUI {
  static readonly IVY_ID = 'ivyEditLabelUi';

  public id(): string {
    return IvyEditLabelUI.IVY_ID;
  }

  protected configureAndAdd(element: HTMLInputElement | HTMLTextAreaElement, containerElement: HTMLElement): void {
    super.configureAndAdd(element, containerElement);
    element.style.top = '3px';
  }
}
