import { Action } from '@eclipse-glsp/client';
import { ElementBreakpoint, SetBreakpointAction, ShowBreakpointAction } from '@ivyteam/process-editor';
import { injectable } from '@theia/core/shared/inversify';
import { IActionHandler } from 'sprotty';

@injectable()
export class SetBreakpointActionHandler implements IActionHandler {
  readonly kinds: string[] = [SetBreakpointAction.KIND];

  private breakpoints: string[] = [];

  handle(action: Action): Action | void {
    if (isSetBreakpointAction(action)) {
      const elementId = action.elementId;
      const bpIndex = this.breakpoints.indexOf(elementId);
      if (bpIndex > -1) {
        this.breakpoints.splice(bpIndex, 1);
      } else {
        this.breakpoints.push(elementId);
      }
      const elementBreakpoints: ElementBreakpoint[] = [];
      for (const breakpoint of this.breakpoints) {
        elementBreakpoints.push({ elementId: breakpoint, condition: 'true', disabled: false });
      }
      return ShowBreakpointAction.create({ elementBreakpoints: elementBreakpoints, globalDisabled: false });
    }
    return;
  }
}

function isSetBreakpointAction(action: Action): action is SetBreakpointAction {
  return action !== undefined && action.kind === SetBreakpointAction.KIND && (action as SetBreakpointAction).elementId !== undefined;
}
