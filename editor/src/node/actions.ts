import { Operation, SModelElement, connectableFeature } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { ActivityTypes } from '../diagram/view-types';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';

export class AttachCommentOperation implements Operation {
  static readonly KIND = 'attachComment';

  constructor(public readonly elementId: string, public readonly kind: string = AttachCommentOperation.KIND) {}
}

@injectable()
export class AttachCommentProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element.hasFeature(connectableFeature) && element.type !== ActivityTypes.COMMENT) {
      return new AttachCommentQuickAction(element.id);
    }
    return undefined;
  }
}

class AttachCommentQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-regular fa-message',
    public readonly title = 'Attach Comment',
    public readonly location = QuickActionLocation.TopLeft,
    public readonly sorting = 'C',
    public readonly action = new AttachCommentOperation(elementId)
  ) {}
}
