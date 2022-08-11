import { Action, EnableDefaultToolsAction, EnableToolsAction, RedoAction, UndoAction } from '@eclipse-glsp/client';
import { IvyMarqueeMouseTool } from './marquee-mouse-tool';
import { injectable, inject, optional } from 'inversify';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { CustomIconToggleActionHandler } from './options/action-handler';
import { SwitchThemeActionHandler } from '../../theme/action-handler';
import { ShowGridActionHandler } from '../../diagram/grid/action-handler';

export interface ToolBarButtonProvider {
  button(): ToolBarButton;
}

export enum ToolBarButtonLocation {
  Left = 'left',
  Middle = 'middle',
  Right = 'right'
}

export interface ToolBarButton {
  icon: string;
  title: string;
  sorting: string;
  action: () => Action;
  location: ToolBarButtonLocation;
  id?: string;
  readonly?: boolean;
  switchFocus?: boolean;
  showTitle?: boolean;
  isNotMenu?: boolean;
}

export function compareButtons(a: ToolBarButton, b: ToolBarButton): number {
  const sortStringBased = a.sorting.localeCompare(b.sorting);
  if (sortStringBased !== 0) {
    return sortStringBased;
  }
  return a.title.localeCompare(b.title);
}

export class DefaultSelectButton implements ToolBarButton {
  constructor(
    public readonly icon = 'si si-cursor',
    public readonly title = 'Selection Tool',
    public readonly sorting = 'A',
    public readonly action = () => EnableDefaultToolsAction.create(),
    public readonly id = 'btn_default_tools',
    public readonly location = ToolBarButtonLocation.Left,
    public readonly readonly = true,
    public readonly switchFocus = true
  ) {}
}

export class MarqueeToolButton implements ToolBarButton {
  constructor(
    public readonly icon = 'si si-cursor-select',
    public readonly title = 'Marquee Tool (Shift)',
    public readonly sorting = 'B',
    public readonly action = () => EnableToolsAction.create([IvyMarqueeMouseTool.ID]),
    public readonly id = 'btn_marquee_tools',
    public readonly location = ToolBarButtonLocation.Left,
    public readonly readonly = true,
    public readonly switchFocus = true
  ) {}
}

export class UndoToolButton implements ToolBarButton {
  constructor(
    public readonly icon = 'si si-undo',
    public readonly title = 'Undo',
    public readonly sorting = 'C',
    public readonly action = () => UndoAction.create(),
    public readonly id = 'btn_undo_tools',
    public readonly location = ToolBarButtonLocation.Left
  ) {}
}

export class RedoToolButton implements ToolBarButton {
  constructor(
    public readonly icon = 'si si-redo',
    public readonly title = 'Redo',
    public readonly sorting = 'D',
    public readonly action = () => RedoAction.create(),
    public readonly id = 'btn_redo_tools',
    public readonly location = ToolBarButtonLocation.Left
  ) {}
}

@injectable()
export class OptionsButtonProvider implements ToolBarButtonProvider {
  @inject(CustomIconToggleActionHandler) protected customIconHandler: CustomIconToggleActionHandler;
  @inject(ShowGridActionHandler) protected gridHandler: ShowGridActionHandler;
  @inject(SwitchThemeActionHandler) @optional() protected switchThemeHandler?: SwitchThemeActionHandler;

  button(): ToolBarButton {
    return new OptionsToolButton(
      () => this.customIconHandler.isShowCustomIcons,
      () => this.gridHandler.isVisible(),
      this.switchThemeHandler ? () => this.switchThemeHandler!.theme() : undefined
    );
  }
}

export class OptionsToolButton implements ToolBarButton {
  constructor(
    public readonly customIconState: () => boolean,
    public readonly grid: () => boolean,
    public readonly theme?: () => string,
    public readonly icon = 'si si-settings',
    public readonly title = 'Options',
    public readonly sorting = 'Z',
    public readonly action = () => ShowToolBarOptionsMenuAction.create({ customIconState: customIconState, grid: grid, theme: theme }),
    public readonly id = 'btn_options_menu',
    public readonly location = ToolBarButtonLocation.Right,
    public readonly readonly = true,
    public readonly switchFocus = true
  ) {}
}
