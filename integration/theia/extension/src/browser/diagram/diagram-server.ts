import { GLSPTheiaDiagramServer } from '@eclipse-glsp/theia-integration/lib/browser';
import { injectable } from 'inversify';
import { ActionHandlerRegistry } from 'sprotty';

@injectable()
export class IvyDiagramServer extends GLSPTheiaDiagramServer {
  initialize(registry: ActionHandlerRegistry): void {
    super.initialize(registry);
  }
}
