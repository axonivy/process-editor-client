import { SModelElement, SModelExtension } from '@eclipse-glsp/client';

export const animateFeature = Symbol('animateFeature');

export interface Animateable extends SModelExtension {
    animated: boolean;
}

export function isAnimateable(element: SModelElement): element is SModelElement & Animateable {
    return element.hasFeature(animateFeature);
}

export function isAnimated(element: SModelElement | undefined): element is SModelElement & Animateable {
    return element !== undefined && isAnimateable(element) && element.animated;
}
