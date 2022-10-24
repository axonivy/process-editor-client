import { ServerMessageAction } from '@eclipse-glsp/client';
import { IvyGLSPDiagramServer } from '@ivyteam/process-editor';

export class IvyEclipseGLSPDiagramServer extends IvyGLSPDiagramServer {
  protected handleServerMessageAction(action: ServerMessageAction): boolean {
    super.handleServerMessageAction(action);
    // send also to server
    return true;
  }
}
