import { CommandExecutionContext, SChildElement, SModelRoot, SRoutableElement, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { BringToFrontAction, BringToFrontCommand } from 'sprotty';

import { LaneNode } from '../diagram/model';

@injectable()
export class IvyBringToFrontCommand extends BringToFrontCommand {
  constructor(@inject(TYPES.Action) public action: BringToFrontAction) {
    super(action);
  }

  execute(context: CommandExecutionContext): SModelRoot {
    const model = context.root;
    this.action.elementIDs.forEach(id => {
      const element = model.index.getById(id);
      if (element instanceof SRoutableElement) {
        if (element.source) {
          this.addToSelection(element.source);
        }
        if (element.target) {
          this.addToSelection(element.target);
        }
      }
      if (element instanceof SChildElement && !(element instanceof LaneNode)) {
        this.addToSelection(element);
      }
      this.includeConnectedEdges(element);
    });
    return this.redo(context);
  }
}
