import { DrawHelperLinesFeedbackCommand } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyDrawHelpersLineFeedbackCommand extends DrawHelperLinesFeedbackCommand {
  protected isMatch(leftCoordinate: number, rightCoordinate: number, epsilon: number): boolean {
    // fix: <= instead of <
    return Math.abs(leftCoordinate - rightCoordinate) <= epsilon;
  }
}
