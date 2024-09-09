import { Action, GLSPActionDispatcher, RequestAction, ResponseAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class PerfActionDispatcher extends GLSPActionDispatcher {
  protected counter = 0;

  override request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<Res> {
    const counter = ++this.counter;
    console.time(`request-${action.kind}-${counter}`);
    const result = super.request(action);
    console.timeEnd(`request-${action.kind}-${counter}`);
    this.counter++;
    return result;
  }

  override async dispatch(action: Action): Promise<void> {
    const counter = ++this.counter;
    console.time(`dispatch-${action.kind}-${counter}`);
    await super.dispatch(action);
    console.timeEnd(`dispatch-${action.kind}-${counter}`);
  }
}
