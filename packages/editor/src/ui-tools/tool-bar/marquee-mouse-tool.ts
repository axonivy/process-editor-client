import { injectable } from 'inversify';
import { MarqueeMouseTool } from '@eclipse-glsp/client';

@injectable()
export class IvyMarqueeMouseTool extends MarqueeMouseTool {
  static ID = 'ivy.marquee-mouse-tool';

  get id(): string {
    return IvyMarqueeMouseTool.ID;
  }

  get isEditTool(): boolean {
    return false;
  }
}
