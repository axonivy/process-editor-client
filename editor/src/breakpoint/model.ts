import { Action, BoundsAware, Hoverable, hoverFeedbackFeature, SChildElement, SModelElement, SParentElement } from 'sprotty';

export const breakpointFeature = Symbol('breakpointFeature');

export type Breakable = BoundsAware;

export function isBreakable(element: SModelElement): element is SModelElement & Breakable {
  return element.hasFeature(breakpointFeature);
}

export function isBreaked(element: SModelElement | undefined): element is SModelElement & Breakable {
  return element !== undefined && isBreakable(element);
}

export class SBreakpointHandle extends SChildElement implements Hoverable {
  static readonly TYPE = 'breakpoint-handle';

  constructor(public readonly type: string = SBreakpointHandle.TYPE,
    public readonly hoverFeedback: boolean = false) {
    super();
  }

  hasFeature(feature: symbol): boolean {
    return feature === hoverFeedbackFeature;
  }

  mouseUp(target: SModelElement): Action[] {
    return [];
  }
}

export function addBreakpointHandles(element: SParentElement): void {
  removeBreakpointHandles(element);
  element.add(new SBreakpointHandle());
}

export function removeBreakpointHandles(element: SParentElement): void {
  element.removeAll(child => child instanceof SBreakpointHandle);
}
