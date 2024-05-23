import {
  ChangeBoundsManager,
  FeedbackEmitter,
  GModelElement,
  SelectionService,
  SetUIExtensionVisibilityAction,
  TrackedMove,
  TrackedResize
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';
import { ShowNegativeAreaAction } from './negative-area/model';

@injectable()
export class IvyChangeBoundsManager extends ChangeBoundsManager {
  @inject(SelectionService) protected selectionService: SelectionService;

  addMoveFeedback(feedback: FeedbackEmitter, trackedMove: TrackedMove, ctx?: GModelElement, event?: MouseEvent): FeedbackEmitter {
    super.addMoveFeedback(feedback, trackedMove, ctx, event);
    this.hideQuickUIFeedback(feedback);
    this.showNegativeArea(feedback);
    return feedback;
  }

  addResizeFeedback(feedback: FeedbackEmitter, resize: TrackedResize, ctx?: GModelElement, event?: MouseEvent): FeedbackEmitter {
    super.addResizeFeedback(feedback, resize, ctx, event);
    this.hideQuickUIFeedback(feedback);
    this.showNegativeArea(feedback);
    return feedback;
  }

  protected hideQuickUIFeedback(feedback: FeedbackEmitter): void {
    feedback.add(
      SetUIExtensionVisibilityAction.create({ extensionId: QuickActionUI.ID, visible: false }),
      SetUIExtensionVisibilityAction.create({
        extensionId: QuickActionUI.ID,
        visible: true,
        contextElementsId: [...this.selectionService.getSelectedElementIDs()]
      })
    );
  }

  protected showNegativeArea(feedback: FeedbackEmitter): void {
    feedback.add(ShowNegativeAreaAction.create({ visible: true }), ShowNegativeAreaAction.create({ visible: false }));
  }
}
