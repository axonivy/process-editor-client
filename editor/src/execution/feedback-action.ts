import { SChildElement } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Command, CommandExecutionContext, SModelRoot, TYPES } from 'sprotty';
import { addCssClass, addCssClassToElements, removeCssClass, removeCssClassOfElements } from '../utils/element-css-classes';
import { ElementExecution } from './action';

import { isExecutable, Executable } from './model';

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
    this.action.oldElementExecutions.forEach(elementExecution => {
      const element = model.index.getById(elementExecution.elementId);
      if (element instanceof SChildElement && isExecutable(element)) {
        const cssClass = elementExecution.failed ? ExecutedFeedbackCommand.FAILED_CSS_CLASS : ExecutedFeedbackCommand.EXECUTED_CSS_CLASS;
        removeCssClass(element, cssClass);
      }
    });
    this.action.elementExecutions.forEach(elementExecution => {
      const element = model.index.getById(elementExecution.elementId);
      if (element instanceof SChildElement && isExecutable(element)) {
        setExecutionCount(element as Executable, elementExecution.count);
        if (elementExecution.failed) {
          this.failed.push(element);
        } else {
          this.executed.push(element);
        }
      }
    });
    return this.redo(context);
  }

  undo(context: CommandExecutionContext): SModelRoot {
    removeCssClassOfElements(this.executed, ExecutedFeedbackCommand.EXECUTED_CSS_CLASS);
    removeCssClassOfElements(this.failed, ExecutedFeedbackCommand.FAILED_CSS_CLASS);
    return context.root;
  }

  redo(context: CommandExecutionContext): SModelRoot {
    addCssClassToElements(this.executed, ExecutedFeedbackCommand.EXECUTED_CSS_CLASS);
    addCssClassToElements(this.failed, ExecutedFeedbackCommand.FAILED_CSS_CLASS);
    return context.root;
  }
}

export class StoppedFeedbackAction {
  constructor(
    public readonly oldStoppedElement: string,
    public readonly stoppedElement: string,
    public readonly kind: string = StoppedFeedbackCommand.KIND
  ) {}
}

@injectable()
export class StoppedFeedbackCommand extends Command {
  static readonly KIND = 'stoppedFeedbackCommand';
  static readonly STOPPED_CSS_CLASS = 'stopped';

  protected stoppedElement: SChildElement;

  constructor(@inject(TYPES.Action) protected readonly action: StoppedFeedbackAction) {
    super();
  }

  execute(context: CommandExecutionContext): SModelRoot {
    const model = context.root;
    const oldElement = model.index.getById(this.action.oldStoppedElement);
    if (oldElement instanceof SChildElement && isExecutable(oldElement)) {
      removeCssClass(oldElement, StoppedFeedbackCommand.STOPPED_CSS_CLASS);
    }
    const element = model.index.getById(this.action.stoppedElement);
    if (element instanceof SChildElement && isExecutable(element)) {
      this.stoppedElement = element;
    }
    return this.redo(context);
  }

  undo(context: CommandExecutionContext): SModelRoot {
    removeCssClass(this.stoppedElement, StoppedFeedbackCommand.STOPPED_CSS_CLASS);
    return context.root;
  }

  redo(context: CommandExecutionContext): SModelRoot {
    addCssClass(this.stoppedElement, StoppedFeedbackCommand.STOPPED_CSS_CLASS);
    return context.root;
  }
}

function setExecutionCount(element: Executable, count: number): void {
  element.executionCount = count;
}
