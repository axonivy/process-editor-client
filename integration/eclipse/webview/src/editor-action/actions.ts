import { Action, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';
import { EventTypes, QuickAction, QuickActionLocation, SingleQuickActionProvider, StartEventNode } from '@ivyteam/process-editor';

@injectable()
export class StarProcessQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof StartEventNode && element.type === EventTypes.START) {
      return new StartProcessQuickAction(element.id);
    }
    return undefined;
  }
}

class StartProcessQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-solid fa-play',
    public readonly title = 'Start Process (X)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'A',
    public readonly action = new StartProcessAction(elementId),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyX'
  ) {}
}

export class StartProcessAction implements Action {
  static readonly KIND = 'startProcess';

  constructor(public readonly elementId: string, public readonly kind: string = StartProcessAction.KIND) {}
}

@injectable()
export class SearchProcessCallersActionProvider extends SingleQuickActionProvider {
  private supportedEventTypes = [
    EventTypes.START,
    EventTypes.START_ERROR,
    EventTypes.START_SUB,
    EventTypes.START_HD,
    EventTypes.START_HD_METHOD
  ];
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof StartEventNode && this.isSearchViewAvailable(element.type)) {
      return new SearchProcessCallersQuickAction(element.id);
    }
    return undefined;
  }

  private isSearchViewAvailable(type: string): boolean {
    return this.supportedEventTypes.includes(type);
  }
}

class SearchProcessCallersQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-solid fa-magnifying-glass',
    public readonly title = 'Search callers of this process (O)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = new SearchProcessCallersAction(elementId),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyO'
  ) {}
}

export class SearchProcessCallersAction implements Action {
  static readonly KIND = 'searchProcessCallers';

  constructor(public readonly elementId: string, public readonly kind: string = SearchProcessCallersAction.KIND) {}
}
