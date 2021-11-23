import { GLSPTheiaDiagramServer } from '@eclipse-glsp/theia-integration';
import { injectable } from '@theia/core/shared/inversify';
import { ActionHandlerRegistry } from 'sprotty';

@injectable()
export class IvyDiagramServer extends GLSPTheiaDiagramServer {
  initialize(registry: ActionHandlerRegistry): void {
    super.initialize(registry);
  }
}
