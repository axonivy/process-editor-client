import { Action } from '@eclipse-glsp/protocol';

export interface EnableViewportAction extends Action {
  kind: typeof EnableViewportAction.KIND;
}

export namespace EnableViewportAction {
  export const KIND = 'enableViewport';

  export function is(object: any): object is EnableViewportAction {
    return Action.hasKind(object, KIND);
  }

  export function create(): EnableViewportAction {
    return { kind: KIND };
  }
}

export interface OriginViewportAction extends Action {
  kind: typeof OriginViewportAction.KIND;
  animate: boolean;
}

export namespace OriginViewportAction {
  export const KIND = 'originViewport';

  export function create(options: { animate?: boolean } = {}): OriginViewportAction {
    return {
      kind: KIND,
      animate: true,
      ...options
    };
  }
}

export interface MoveIntoViewportAction extends Action {
  kind: typeof MoveIntoViewportAction.KIND;
  elementIds: string[];
  animate: boolean;
  retainZoom: boolean;
}

export namespace MoveIntoViewportAction {
  export const KIND = 'moveIntoViewport';

  export function create(options: { elementIds: string[]; animate?: boolean; retainZoom?: boolean }): MoveIntoViewportAction {
    return {
      kind: KIND,
      animate: true,
      retainZoom: false,
      ...options
    };
  }
}

export interface SetViewportZoomAction extends Action {
  kind: typeof SetViewportZoomAction.KIND;
  zoom: number;
}

export namespace SetViewportZoomAction {
  export const KIND = 'ivyViewportZoom';

  export function is(object: any): object is SetViewportZoomAction {
    return Action.hasKind(object, KIND);
  }

  export function create(options: { zoom: number }): SetViewportZoomAction {
    return {
      kind: KIND,
      ...options
    };
  }
}
