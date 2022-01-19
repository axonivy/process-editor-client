import { SChildElement } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Command, CommandExecutionContext, SModelRoot, TYPES } from 'sprotty';
import { addCssClass, removeCssClass } from '../utils/element-css-classes';
import { ElementExecution } from './action';

import { isExecutable } from './model';

export class ExecutedFeedbackAction {
  constructor(
    public readonly oldElementExecutions: ElementExecution[] = [],
    public readonly elementExecutions: ElementExecution[] = [],
    public readonly kind: string = ExecutedFeedbackCommand.KIND
  ) {}
}

@injectable()
export class ExecutedFeedbackCommand extends Command {
  static readonly KIND = 'executedFeedbackCommand';
  static readonly EXECUTED_CSS_CLASS = 'executed';
  static readonly FAILED_CSS_CLASS = 'failed';

  protected executed: SChildElement[] = [];
  protected failed: SChildElement[] = [];

  constructor(@inject(TYPES.Action) protected readonly action: ExecutedFeedbackAction) {
    super();
  }

  execute(context: CommandExecutionContext): SModelRoot {
    const model = context.root;
    this.action.oldElementExecutions.forEach(elementExectuion => {
      const element = model.index.getById(elementExectuion.elementId);
      if (element instanceof SChildElement && isExecutable(element)) {
        const cssClass = elementExectuion.failed ? ExecutedFeedbackCommand.FAILED_CSS_CLASS : ExecutedFeedbackCommand.EXECUTED_CSS_CLASS;
        removeCssClass(element, cssClass);
      }
    });
    this.action.elementExecutions.forEach(elementExectuion => {
      const element = model.index.getById(elementExectuion.elementId);
      if (element instanceof SChildElement && isExecutable(element)) {
        if (elementExectuion.failed) {
          this.failed.push(element);
        } else {
          this.executed.push(element);
        }
      }
    });
    return this.redo(context);
  }

  undo(context: CommandExecutionContext): SModelRoot {
    this.removeCssClassOfElements(this.executed, ExecutedFeedbackCommand.EXECUTED_CSS_CLASS);
    this.removeCssClassOfElements(this.failed, ExecutedFeedbackCommand.FAILED_CSS_CLASS);
    return context.root;
  }

  redo(context: CommandExecutionContext): SModelRoot {
    this.addCssClassToElements(this.executed, ExecutedFeedbackCommand.EXECUTED_CSS_CLASS);
    this.addCssClassToElements(this.failed, ExecutedFeedbackCommand.FAILED_CSS_CLASS);
    return context.root;
  }

  addCssClassToElements(elements: SChildElement[], cssClass: string): void {
    for (const element of elements) {
      addCssClass(element, cssClass);
    }
  }

  removeCssClassOfElements(elements: SChildElement[], cssClass: string): void {
    for (const element of elements) {
      removeCssClass(element, cssClass);
    }
  }
}
