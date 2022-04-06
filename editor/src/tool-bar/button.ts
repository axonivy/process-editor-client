import { Action, CenterAction, DeleteElementOperation } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { OriginViewportAction } from '../viewport/viewport-commands';

import { FitToScreenAction } from 'sprotty';
import { JumpAction } from '../jump/action';
import { WrapToSubOperation } from '../wrap/actions';
import { AutoAlignOperation } from './operation';

export interface ToolBarButton {
  icon: string;
  title: string;
  sorting: string;
  action: () => Action;
  visible: boolean;
  id?: string;
}

export interface ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton;
}

class CenterButton implements ToolBarButton {
  constructor(
    public readonly elementIds: () => string[],
    public readonly icon = 'fa-solid fa-crosshairs',
    public readonly title = 'Center',
    public readonly sorting = 'C',
    public readonly visible = true,
    public readonly action = () => new CenterAction(elementIds())
  ) {}
}

@injectable()
export class CenterButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new CenterButton(elementIds);
  }
}

class OriginScreenButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-solid fa-display',
    public readonly title = 'Origin screen',
    public readonly sorting = 'A',
    public readonly visible = true,
    public readonly action = () => new OriginViewportAction()
  ) {}
}

@injectable()
export class OriginScreenButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new OriginScreenButton();
  }
}

class FitToScreenButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-solid fa-vector-square',
    public readonly title = 'Fit to screen',
    public readonly sorting = 'B',
    public readonly visible = true,
    public readonly action = () => new FitToScreenAction([])
  ) {}
}

@injectable()
export class FitToScreenButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new FitToScreenButton();
  }
}

export class JumpOutButton implements ToolBarButton {
  static readonly ID = 'jumpoutbutton';
  constructor(
    public readonly icon = 'fa-solid fa-turn-up',
    public readonly title = 'Jump out (J)',
    public readonly sorting = 'A',
    public readonly visible = false,
    public readonly action = () => new JumpAction(''),
    public readonly id = JumpOutButton.ID
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
    public readonly action = () => new DeleteElementOperation(elementIds()),
    public readonly id = DeleteButton.ID
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
    public readonly action = () => new WrapToSubOperation(elementIds()),
    public readonly id = WrapToSubButton.ID
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
    public readonly action = () => new AutoAlignOperation(elementIds()),
    public readonly id = AutoAlignButton.ID
  ) {}
}

@injectable()
export class AutoAlignButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new AutoAlignButton(elementIds);
  }
}
