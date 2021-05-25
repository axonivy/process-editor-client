import { Hoverable, SChildElement, SModelElement, SParentElement } from '@eclipse-glsp/client';

export const jumpFeature = Symbol('jumpFeature');

export function isOpenable(element: SModelElement): element is SModelElement {
    return element.hasFeature(jumpFeature);
}

export class SJumpOutHandle extends SChildElement implements Hoverable {
    static readonly TYPE = 'jump-out-handle';

    constructor(public readonly type: string = SJumpOutHandle.TYPE,
        public readonly hoverFeedback: boolean = false) {
        super();
    }
}

export function addJumpOutHandles(element: SParentElement): void {
    removeJumpOutHandles(element);
    element.add(new SJumpOutHandle());
}

export function removeJumpOutHandles(element: SParentElement): void {
    element.removeAll(child => child instanceof SJumpOutHandle);
}
