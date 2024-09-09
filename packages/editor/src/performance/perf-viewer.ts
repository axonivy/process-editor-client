import { Action, GModelRoot, ModelViewer } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class PerfModelViewer extends ModelViewer {
  protected counter = 0;

  update(model: Readonly<GModelRoot>, cause?: Action): void {
    const counter = ++this.counter;
    console.time('Viewer update ' + counter);
    super.update(model, cause);
    console.timeEnd('Viewer update ' + counter);
  }
}
