import { Action, DeleteElementOperation, EditLabelAction, isDeletable, isWithEditableLabel, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';

import { AutoAlignOperation } from '../tool-bar/operation';

export enum QuickActionLocation {
  TopLeft = 'top-left',
  Left = 'left',
  Right = 'right',
  BottomLeft = 'bottom-left'
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

@injectable()
export class EditLabelActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isWithEditableLabel(element) && element.editableLabel) {
      return new EditLabelQuickAction(element.editableLabel.id);
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
  readonlySupport?: boolean;
  shortcut?: KeyCode;
}

class DeleteQuickAction implements QuickAction {
  constructor(
    public readonly elementIds: string[],
    public readonly icon = 'fa-solid fa-trash',
    public readonly title = 'Delete',
    public readonly location = QuickActionLocation.TopLeft,
    public readonly sorting = 'A',
    public readonly action = new DeleteElementOperation(elementIds)
  ) {}
}

class AutoAlignQuickAction implements QuickAction {
  constructor(
    public readonly elementIds: string[],
    public readonly icon = 'fa-solid fa-up-down-left-right',
    public readonly title = 'Auto Align (A)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'Z',
    public readonly action = new AutoAlignOperation(elementIds),
    public readonly shortcut: KeyCode = 'KeyA'
  ) {}
}

class EditLabelQuickAction implements QuickAction {
  constructor(
    public readonly labelId: string,
    public readonly icon = 'fa-solid fa-tag',
    public readonly title = 'Edit Label (L)',
    public readonly location = QuickActionLocation.TopLeft,
    public readonly sorting = 'B',
    public readonly action = new EditLabelAction(labelId),
    public readonly shortcut: KeyCode = 'KeyL'
  ) {}
}
