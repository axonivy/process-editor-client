import { SModelElement } from '@eclipse-glsp/client';

export const jumpFeature = Symbol('jumpFeature');

export function isOpenable(element: SModelElement): element is SModelElement {
    return element.hasFeature(jumpFeature);
}
