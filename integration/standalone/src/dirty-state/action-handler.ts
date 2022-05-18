import { injectable } from 'inversify';
import { Action, IActionHandler } from 'sprotty';

export class SetDirtyStateAction implements Action {
  static readonly KIND = 'setDirtyState';

  constructor(public readonly isDirty: boolean, public readonly reason: string, public readonly kind: string = SetDirtyStateAction.KIND) {}
}

@injectable()
export class SetDirtyStateActionHandler implements IActionHandler {
  handle(action: SetDirtyStateAction): void {
    const url = document.URL;
    let processName = url.substring(url.lastIndexOf('/') + 1);
    if (action.isDirty) {
      processName = '* ' + processName;
    }
    document.title = processName;
  }
}
