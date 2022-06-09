import {
  MouseListener,
  Action,
  Command,
  CommandExecutionContext,
  SChildElement,
  SModelElement,
  SModelRoot,
  TYPES
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { ToggleBreakpointAction } from './action';
import { ElementBreakpoint } from './action-handler';

import { addBreakpointHandles, Breakable, isBreakable, removeBreakpointHandles, SBreakpointHandle } from './model';

export interface BreakpointFeedbackAction extends Action {
  kind: typeof BreakpointFeedbackCommand.KIND;
  breakpoints: ElementBreakpoint[];
  oldBreakpoints?: ElementBreakpoint[];
  globalDisabled?: boolean;
}

export namespace BreakpointFeedbackAction {
  export function create(options: {
    breakpoints: ElementBreakpoint[];
    oldBreakpoints?: ElementBreakpoint[];
    globalDisabled?: boolean;
  }): BreakpointFeedbackAction {
    return {
      kind: BreakpointFeedbackCommand.KIND,
      ...options
    };
  }
}

@injectable()
export class BreakpointFeedbackCommand extends Command {
  static readonly KIND = 'elementBreakpointFeedback';

  protected showBreakpoints: { element: SChildElement & Breakable; condition: string; disabled: boolean; globalDisabled: boolean }[] = [];

  constructor(@inject(TYPES.Action) protected readonly action: BreakpointFeedbackAction) {
    super();
  }

  execute(context: CommandExecutionContext): SModelRoot {
    this.action.oldBreakpoints?.forEach(breakpoint => {
      const element = context.root.index.getById(breakpoint.elementId);
      if (element instanceof SChildElement && isBreakable(element)) {
        removeBreakpointHandles(element);
      }
    });
    this.action.breakpoints.forEach(breakpoint => {
      const element = context.root.index.getById(breakpoint.elementId);
      if (element instanceof SChildElement && isBreakable(element)) {
        this.showBreakpoints.push({
          element: element,
          condition: breakpoint.condition,
          disabled: breakpoint.disabled,
          globalDisabled: this.action.globalDisabled ?? false
        });
      }
    });
    return this.redo(context);
  }

  undo(context: CommandExecutionContext): SModelRoot {
    for (const breakpoint of this.showBreakpoints) {
      removeBreakpointHandles(breakpoint.element);
    }
    return context.root;
  }

  redo(context: CommandExecutionContext): SModelRoot {
    for (const element of this.showBreakpoints) {
      addBreakpointHandles(element.element, element.condition, element.disabled, element.globalDisabled);
    }
    return context.root;
  }
}

@injectable()
export class BreakpointMouseListener extends MouseListener {
  mouseUp(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    if (target instanceof SBreakpointHandle) {
      return [ToggleBreakpointAction.create({ elementId: target.parent.id, disable: !target.disabled })];
    }
    return [];
  }
}
