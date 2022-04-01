import { Action, CenterAction, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { OriginViewportAction } from '../viewport/original-viewport';

import { FitToScreenAction } from 'sprotty';

export interface ToolBarButton {
  icon: string;
  title: string;
  sorting: string;
  action: Action;
  visible: boolean;
  cssClasses?: string[];
  readonlySupport?: boolean;
}

export interface ToolBarButtonProvider {
  button(elements: SModelElement[]): ToolBarButton | undefined;
}

class CenterButton implements ToolBarButton {
  constructor(
    public readonly elementIds: string[],
    public readonly icon = 'fa-crosshairs',
    public readonly title = 'Center',
    public readonly sorting = 'C',
    public readonly visible = true,
    public readonly action = new CenterAction(elementIds)
  ) {}
}

@injectable()
export class CenterButtonProvider implements ToolBarButtonProvider {
  button(elements: SModelElement[]): ToolBarButton | undefined {
    const elementIds = elements.map(e => e.id);
    return new CenterButton(elementIds);
  }
}

class OriginScreenButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-desktop',
    public readonly title = 'Origin screen',
    public readonly sorting = 'A',
    public readonly visible = true,
    public readonly action = new OriginViewportAction()
  ) {}
}

@injectable()
export class OriginScreenButtonProvider implements ToolBarButtonProvider {
  button(elements: SModelElement[]): ToolBarButton | undefined {
    return new OriginScreenButton();
  }
}

class FitToScreenButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-vector-square',
    public readonly title = 'Fit to screen',
    public readonly sorting = 'B',
    public readonly visible = true,
    public readonly action = new FitToScreenAction([])
  ) {}
}

@injectable()
export class FitToScreenButtonProvider implements ToolBarButtonProvider {
  button(elements: SModelElement[]): ToolBarButton | undefined {
    return new FitToScreenButton();
  }
}
