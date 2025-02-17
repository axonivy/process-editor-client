import {
  Action,
  type BoundsAware,
  type Hoverable,
  hoverFeedbackFeature,
  SChildElement,
  selectFeature,
  SModelElement,
  SParentElement
} from '@eclipse-glsp/client';

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

  constructor(
    public readonly condition: string = '',
    public readonly disabled: boolean = false,
    public readonly globalDisabled: boolean = false,
    public readonly type: string = SBreakpointHandle.TYPE,
    public readonly hoverFeedback: boolean = false
  ) {
    super();
  }

  hasFeature(feature: symbol): boolean {
    return feature === hoverFeedbackFeature || feature === selectFeature;
  }

  mouseUp(target: SModelElement): Action[] {
    return [];
  }
}

export function addBreakpointHandles(element: SParentElement, condition: string, disabled: boolean, globalDisabled: boolean): void {
  removeBreakpointHandles(element);
  element.add(new SBreakpointHandle(condition, disabled, globalDisabled));
}

export function removeBreakpointHandles(element: SParentElement): void {
  element.removeAll(child => child instanceof SBreakpointHandle);
}
