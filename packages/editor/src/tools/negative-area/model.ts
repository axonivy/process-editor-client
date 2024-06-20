import {
  Action,
  Bounds,
  CommandExecutionContext,
  CommandReturn,
  Disposable,
  FeedbackCommand,
  GChildElement,
  GModelElement,
  TYPES,
  getModelBounds,
  isViewport
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

export class NegativeMarker extends GChildElement {
  static readonly TYPE = 'negative-marker';

  constructor(
    public readonly canvasBounds: Bounds = Bounds.EMPTY,
    public readonly modelBounds: Bounds = Bounds.EMPTY,
    public readonly type: string = NegativeMarker.TYPE
  ) {
    super();
  }
}

export function addNegativeArea(element: GModelElement): Disposable {
  removeNegativeArea(element);
  const canvasBounds = element.root.canvasBounds;
  if (isViewport(element.root)) {
    const modelBounds = getModelBounds(element.root);
    element.root.add(new NegativeMarker(canvasBounds, modelBounds!));
    return Disposable.create(() => removeNegativeArea(element));
  }
  return Disposable.empty();
}

export function removeNegativeArea(element: GModelElement): void {
  element.root.removeAll(child => child instanceof NegativeMarker);
}

export interface ShowNegativeAreaAction extends Action {
  kind: typeof ShowNegativeAreaAction.KIND;
  visible: boolean;
}

export namespace ShowNegativeAreaAction {
  export const KIND = 'showNegativeArea';

  export function create(options: { visible: boolean }): ShowNegativeAreaAction {
    return {
      kind: KIND,
      visible: options.visible
    };
  }
}

@injectable()
export class ShowNegativeAreaFeedbackCommand extends FeedbackCommand {
  static readonly KIND = ShowNegativeAreaAction.KIND;

  @inject(TYPES.Action) protected action: ShowNegativeAreaAction;

  execute(context: CommandExecutionContext): CommandReturn {
    if (this.action.visible) {
      addNegativeArea(context.root);
    } else {
      removeNegativeArea(context.root);
    }
    return context.root;
  }
}
