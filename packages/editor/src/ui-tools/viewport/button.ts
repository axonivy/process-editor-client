import { Action, CenterAction, FitToScreenAction } from '@eclipse-glsp/client';
import { IvyIcons } from '@axonivy/ui-icons';
import { OriginViewportAction } from '@axonivy/process-editor-protocol';

export interface ViewportBarButton {
  icon: IvyIcons;
  id: string;
  title: string;
  action: () => Action;
}

export class CenterButton implements ViewportBarButton {
  constructor(
    public readonly elementIds: () => string[],
    public readonly icon = IvyIcons.Center,
    public readonly id = 'centerBtn',
    public readonly title = 'Center',
    public readonly action = () => CenterAction.create(elementIds())
  ) {}
}

export class OriginScreenButton implements ViewportBarButton {
  constructor(
    public readonly icon = IvyIcons.WindowMinimize,
    public readonly id = 'originBtn',
    public readonly title = 'Origin screen',
    public readonly action = () => OriginViewportAction.create()
  ) {}
}

export class FitToScreenButton implements ViewportBarButton {
  constructor(
    public readonly icon = IvyIcons.FitToScreen,
    public readonly id = 'fitToScreenBtn',
    public readonly title = 'Fit to screen',
    public readonly action = () => FitToScreenAction.create([], { padding: 10 })
  ) {}
}
