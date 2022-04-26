import { findParentByFeature, isOpenable, MouseListener, SModelElement } from '@eclipse-glsp/client';
import { Action } from '@eclipse-glsp/protocol';
import { OpenInscriptionAction } from './open-inscription-handler';

export class OpenInscriptionMouseListener extends MouseListener {
  doubleClick(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    const element = findParentByFeature(target, isOpenable);
    if (element) {
      return [new OpenInscriptionAction(element.id)];
    }
    return [];
  }
}
