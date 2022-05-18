import { injectable } from 'inversify';
import { Action, IActionHandler } from 'sprotty';

export class StandaloneShowBreakpointAction implements Action {
  static readonly KIND = 'showBreakpoints';

  constructor(public readonly kind: string = StandaloneShowBreakpointAction.KIND) {}
}

@injectable()
export class StandaloneShowBreakpointActionHandler implements IActionHandler {
  handle(action: StandaloneShowBreakpointAction): void {
    return;
  }
}
