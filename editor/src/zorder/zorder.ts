import { SChildElement, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { BringToFrontAction, BringToFrontCommand } from 'sprotty';

import { LaneNode } from '../diagram/model';

@injectable()
export class IvyBringToFrontCommand extends BringToFrontCommand {
  constructor(@inject(TYPES.Action) public action: BringToFrontAction) {
    super(action);
  }

  protected addToSelection(element: SChildElement): void {
    if (element instanceof LaneNode) {
      return;
    }
    this.selected.push({
      element: element,
      index: element.parent.children.indexOf(element)
    });
  }
}