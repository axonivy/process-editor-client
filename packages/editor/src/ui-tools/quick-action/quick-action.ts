import { Action, DeleteElementOperation, isDeletable, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';
import { StreamlineIcons } from '../../StreamlineIcons';
import { AutoAlignOperation } from '@axonivy/process-editor-protocol';

export enum QuickActionLocation {
  Left = '1',
  Middle = '2',
  Right = '3',
  Hidden = 'hidden'
}

export interface QuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined;
  multiQuickAction(elements: SModelElement[]): QuickAction | undefined;
}

@injectable()
export abstract class SingleQuickActionProvider implements QuickActionProvider {
  abstract singleQuickAction(element: SModelElement): QuickAction | undefined;
  multiQuickAction(elements: SModelElement[]): undefined {
    return undefined;
  }
}

@injectable()
export abstract class MultipleQuickActionProvider implements QuickActionProvider {
  abstract multiQuickAction(elements: SModelElement[]): QuickAction | undefined;
  singleQuickAction(element: SModelElement): undefined {
    return undefined;
  }
}

@injectable()
export class DeleteQuickActionProvider implements QuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isDeletable(element)) {
      return new DeleteQuickAction([element.id]);
    }
    return undefined;
  }

  multiQuickAction(elements: SModelElement[]): QuickAction | undefined {
    const elementIds = elements.filter(e => isDeletable(e)).map(e => e.id);
    if (elementIds.length > 0) {
      return new DeleteQuickAction(elementIds);
    }
    return undefined;
  }
}

@injectable()
export class AutoAlignQuickActionProvider extends MultipleQuickActionProvider {
  multiQuickAction(elements: SModelElement[]): QuickAction | undefined {
    const elementIds = elements.map(e => e.id);
    if (elementIds.length > 0) {
      return new AutoAlignQuickAction(elementIds);
    }
    return undefined;
  }
}

export interface QuickAction {
  icon: string;
  title: string;
  location: QuickActionLocation;
  sorting: string;
  action: Action;
  letQuickActionsOpen?: boolean;
  readonlySupport?: boolean;
  shortcut?: KeyCode;
  removeSelection?: boolean;
}

class DeleteQuickAction implements QuickAction {
  constructor(
    public readonly elementIds: string[],
    public readonly icon = StreamlineIcons.Delete,
    public readonly title = 'Delete',
    public readonly location = QuickActionLocation.Left,
    public readonly sorting = 'A',
    public readonly action = DeleteElementOperation.create(elementIds)
  ) {}
}

class AutoAlignQuickAction implements QuickAction {
  constructor(
    public readonly elementIds: string[],
    public readonly icon = StreamlineIcons.AutoAlign,
    public readonly title = 'Auto Align (A)',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'Z',
    public readonly action = AutoAlignOperation.create({ elementIds: elementIds }),
    public readonly shortcut: KeyCode = 'KeyA'
  ) {}
}
