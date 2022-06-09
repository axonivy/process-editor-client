import { Action, CenterAction, FitToScreenAction } from '@eclipse-glsp/client';
import { OriginViewportAction } from '../viewport/viewport-commands';

export interface ViewportBarButton {
  icon: string;
  id: string;
  title: string;
  action: () => Action;
}

export class CenterButton implements ViewportBarButton {
  constructor(
    public readonly elementIds: () => string[],
    public readonly icon = 'fa-solid fa-crosshairs',
    public readonly id = 'centerBtn',
    public readonly title = 'Center',
    public readonly action = () => CenterAction.create(elementIds())
  ) {}
}

export class OriginScreenButton implements ViewportBarButton {
  constructor(
    public readonly icon = 'fa-solid fa-display',
    public readonly id = 'originBtn',
    public readonly title = 'Origin screen',
    public readonly action = () => OriginViewportAction.create()
  ) {}
}

export class FitToScreenButton implements ViewportBarButton {
  constructor(
    public readonly icon = 'fa-solid fa-vector-square',
    public readonly id = 'fitToScreenBtn',
    public readonly title = 'Fit to screen',
    public readonly action = () => FitToScreenAction.create([])
  ) {}
}
