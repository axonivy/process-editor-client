import { isOpenable, MouseListener, SModelElement } from '@eclipse-glsp/client';
import { Action } from '@eclipse-glsp/protocol';
import { OpenInscriptionAction } from './open-inscription-handler';

export class OpenInscriptionMouseListener extends MouseListener {
  doubleClick(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    if (isOpenable(target)) {
      return [new OpenInscriptionAction(target.id)];
    }
    return [];
  }
}
