import { ChangeBoundsTool, MouseListener, ChangeBoundsListener, SModelElement } from '@eclipse-glsp/client';
import { SelectionListener } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { Action } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';

@injectable()
export class IvyChangeBoundsTool extends ChangeBoundsTool {
  protected createChangeBoundsListener(): MouseListener & SelectionListener {
    return new IvyChangeBoundsListener(this);
  }
}

export class IvyChangeBoundsListener extends ChangeBoundsListener {
  protected handleMoveRoutingPointsOnServer(target: SModelElement): Action[] {
    return [];
  }
}
