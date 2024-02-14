import { HelperLineManager, SetBoundsAction, SetBoundsFeedbackAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyHelperLineManager extends HelperLineManager {
  protected handleSetBoundsAction(action: SetBoundsAction | SetBoundsFeedbackAction): void {
    this.feedback.dispose();
    super.handleSetBoundsAction(action);
  }
}
