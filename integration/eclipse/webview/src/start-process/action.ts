import { Action, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';
import { QuickAction, QuickActionLocation, SingleQuickActionProvider, StartEventNode } from '@ivyteam/process-editor';

@injectable()
export class StarProcessQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof StartEventNode) {
      return new StartProcessQuickAction(element.id);
    }
    return undefined;
  }
}

class StartProcessQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-play',
    public readonly title = 'Start Process (X)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'A',
    public readonly action = new StartProcessAction(elementId),
    public readonly shortcut: KeyCode = 'KeyX'
  ) {}
}

export class StartProcessAction implements Action {
  static readonly KIND = 'startProcess';

  constructor(public readonly elementId: string, public readonly kind: string = StartProcessAction.KIND) {}
}
