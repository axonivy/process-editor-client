import {
  Action,
  IActionDispatcher,
  IActionHandler,
  IFeedbackActionDispatcher,
  SetViewportAction,
  TYPES,
  ViewerOptions
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { IvyGridSnapper } from '../snap';
import { GridFeedbackAction } from './feedback-action';
import { ShowGridAction } from '@axonivy/process-editor-protocol';

@injectable()
export class ShowGridActionHandler implements IActionHandler {
  private show: boolean;

  @inject(TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  @inject(TYPES.ViewerOptions) protected options: ViewerOptions;

  handle(action: Action): Action | void {
    if (ShowGridAction.is(action)) {
      this.show = action.show;
      if (action.show) {
        this.feedbackDispatcher.registerFeedback(this, [GridFeedbackAction.create({ show: action.show })]);
      } else {
        this.feedbackDispatcher.deregisterFeedback(this, [GridFeedbackAction.create({ show: action.show })]);
      }
    }
    if (SetViewportAction.is(action)) {
      this.moveGrid(action);
    }
  }

  moveGrid(action: SetViewportAction): void {
    const baseDiv = document.querySelector(`#${this.options.baseDiv} .sprotty-graph`) as HTMLElement;
    if (baseDiv) {
      const newPosX = (-action.newViewport.scroll.x + IvyGridSnapper.GRID_X) * action.newViewport.zoom;
      const newPosY = (-action.newViewport.scroll.y + IvyGridSnapper.GRID_Y) * action.newViewport.zoom;
      baseDiv.style.backgroundPosition = `${newPosX}px ${newPosY}px`;
      const newSize = IvyGridSnapper.GRID_X * 2 * action.newViewport.zoom;
      baseDiv.style.backgroundSize = `${newSize}px ${newSize}px`;
    }
  }

  isVisible(): boolean {
    return this.show;
  }
}
