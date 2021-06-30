import { Action } from '@eclipse-glsp/client';
import { BreakpointAction, isBreakpointAction, ShowBreakpointAction } from '@ivyteam/process-editor';
import { injectable } from 'inversify';
import { IActionHandler } from 'sprotty';

@injectable()
export class BreakpointActionHandler implements IActionHandler {

  readonly kinds: string[] = [BreakpointAction.KIND];

  private breakpoints: string[] = [];

  handle(action: Action): Action | void {
    if (isBreakpointAction(action)) {
      const elementId = action.elementId;
      const bpIndex = this.breakpoints.indexOf(elementId);
      if (bpIndex > -1) {
        this.breakpoints.splice(bpIndex, 1);
      } else {
        this.breakpoints.push(elementId);
      }
      return new ShowBreakpointAction(this.breakpoints);
    }
    return;
  }

}
