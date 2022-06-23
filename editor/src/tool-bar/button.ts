import { Action, DeleteElementOperation } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { JumpAction } from '../jump/action';
import { WrapToSubOperation } from '../wrap/actions';
import { AutoAlignOperation } from './operation';

export enum ToolBarButtonLocation {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

export interface ToolBarButton {
  icon: string;
  title: string;
  sorting: string;
  action: () => Action;
  visible: boolean;
  location: ToolBarButtonLocation;
  id?: string;
}

export interface ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton;
}

export class JumpOutButton implements ToolBarButton {
  static readonly ID = 'jumpoutbutton';
  constructor(
    public readonly icon = 'fa-solid fa-turn-up',
    public readonly title = 'Jump out (J)',
    public readonly sorting = 'A',
    public readonly visible = false,
    public readonly action = () => JumpAction.create({ elementId: '' }),
    public readonly id = JumpOutButton.ID,
    public readonly location = ToolBarButtonLocation.Center
  ) {}
}

@injectable()
export class JumpOutButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new JumpOutButton();
  }
}

export class DeleteButton implements ToolBarButton {
  static readonly ID = 'deletebutton';
  constructor(
    public readonly elementIds: () => string[],
    public readonly icon = 'fa-solid fa-trash',
    public readonly title = 'Delete',
    public readonly sorting = 'B',
    public readonly visible = false,
    public readonly action = () => DeleteElementOperation.create(elementIds()),
    public readonly id = DeleteButton.ID,
    public readonly location = ToolBarButtonLocation.Center
  ) {}
}

@injectable()
export class DeleteButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new DeleteButton(elementIds);
  }
}

export class WrapToSubButton implements ToolBarButton {
  static readonly ID = 'wraptosubbutton';
  constructor(
    public readonly elementIds: () => string[],
    public readonly icon = 'fa-solid fa-minimize',
    public readonly title = 'Wrap to embedded process',
    public readonly sorting = 'C',
    public readonly visible = false,
    public readonly action = () => WrapToSubOperation.create({ elementIds: elementIds() }),
    public readonly id = WrapToSubButton.ID,
    public readonly location = ToolBarButtonLocation.Center
  ) {}
}

@injectable()
export class WrapToSubButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new WrapToSubButton(elementIds);
  }
}

export class AutoAlignButton implements ToolBarButton {
  static readonly ID = 'autoalignbutton';
  constructor(
    public readonly elementIds: () => string[],
    public readonly icon = 'fa-solid fa-up-down-left-right',
    public readonly title = 'Auto align',
    public readonly sorting = 'D',
    public readonly visible = false,
    public readonly action = () => AutoAlignOperation.create({ elementIds: elementIds() }),
    public readonly id = AutoAlignButton.ID,
    public readonly location = ToolBarButtonLocation.Center
  ) {}
}

@injectable()
export class AutoAlignButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new AutoAlignButton(elementIds);
  }
}
